import { inject, injectable }   from "inversify";
import { TYPES }                from "../types";
import { ILocalizationService,
        IFileService,
        IProjectService,
        IProjectRepository,
        IUserService }          from "../contracts";
import { BaseService }          from "./BaseService";
import { Project,
    ProjectImage,
    ProjectNeed,
    ProjectUpdate,
    User }                      from "../models";
import { FileType }             from "../enums/FileType";
import { CreateProjectDTO }     from "../dtos/projects";
import { AWS }                  from "../utils";

@injectable()
export class ProjectService extends BaseService<Project> implements IProjectService {

    private readonly _userService: IUserService;
    private readonly _fileService: IFileService;

    constructor(@inject(TYPES.ProjectRepository) projectRepository: IProjectRepository,
                    @inject(TYPES.LocalizationService) localizationService: ILocalizationService,
                    @inject(TYPES.FileService) fileService: IFileService,
                    @inject(TYPES.UserService) userService: IUserService) {
        super(projectRepository, localizationService);
        this._userService = userService;
        this._fileService = fileService;
    }

    public async createProject(email: string, createProjectDTO: CreateProjectDTO): Promise<Project> {
        const dbUser: User = await this._userService.getByEmail(email);

        const budget: number = +createProjectDTO.Budget || 0;

        const project: Project = {
            Name: createProjectDTO.Name,
            Description: createProjectDTO.Description,
            Email: createProjectDTO.Email,
            PhoneNumber: createProjectDTO.PhoneNumber,
            Date: createProjectDTO.Date,
            Budget: budget,
            Currency: createProjectDTO.Currency,
            City: createProjectDTO.City,
            Visibility: createProjectDTO.Visibility,
            Initiator: dbUser
        } as Project;

        if (createProjectDTO.Image) {
            const uploadProjectImageResult: any = await this._fileService.uploadFile(createProjectDTO.Image, FileType.Image, email);

            const projectImage = {
                Key: uploadProjectImageResult.Key,
                Location: uploadProjectImageResult.Location,
                ThumbnailLocation: AWS.getThumbnailURL(uploadProjectImageResult.Key),
                Size: Math.round(createProjectDTO.Image.size * 100 / (1000 * 1000)) / 100, // in MB
            } as ProjectImage;

            project.Image = projectImage;
        }

        if (createProjectDTO.Needs) {
            const needs: ProjectNeed[] = typeof createProjectDTO.Needs === "string" ?
                                                    JSON.parse(createProjectDTO.Needs) : createProjectDTO.Needs;

            project.Needs = [];
            needs.forEach((n: ProjectNeed ) => {
                const need: ProjectNeed = {
                    Description: n.Description,
                    IsMandatory: n.IsMandatory
                } as ProjectNeed;

                project.Needs.push(need);
            });
        }

        project.Updates = [];
        project.Updates.push({
            Description: this._localizationService.getText("content.project-created"),
            Date: createProjectDTO.DateCreated
        } as ProjectUpdate);

        const dbProject: Project = await this.create(project);

        return dbProject;
    }

}
