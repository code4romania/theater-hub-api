import { inject, injectable }       from "inversify";
import { TYPES }                    from "../types";
import { ILocalizationService,
        IFileService,
        IProjectService,
        IProjectRepository,
        IUserService }              from "../contracts";
import { BaseService }              from "./BaseService";
import { Project,
    ProjectImage,
    ProjectNeed,
    ProjectUpdate,
    User }                          from "../models";
import { FileType }                 from "../enums/FileType";
import { UserRoleType }             from "../enums/UserRoleType";
import { VisibilityType }           from "../enums/VisibilityType";
import { CreateProjectDTO,
         MyProjectDTO,
         ProjectDTO,
         ProjectListItem,
         GetAllProjectsResponse }   from "../dtos/projects";
import { AWS }                      from "../utils";

@injectable()
export class ProjectService extends BaseService<Project> implements IProjectService {

    private readonly _userService: IUserService;
    private readonly _fileService: IFileService;
    private readonly _projectRepository: IProjectRepository;

    constructor(@inject(TYPES.ProjectRepository) projectRepository: IProjectRepository,
                    @inject(TYPES.LocalizationService) localizationService: ILocalizationService,
                    @inject(TYPES.FileService) fileService: IFileService,
                    @inject(TYPES.UserService) userService: IUserService) {
        super(projectRepository, localizationService);
        this._userService       = userService;
        this._fileService       = fileService;
        this._projectRepository = projectRepository;
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

    public async getProject(email: string, id: string): Promise<ProjectDTO> {
        let me: User;
        let fullViewingRights: boolean;
        const viewerIsVisitor: boolean = !email;
        let project: Project;
        let otherProjects: Project[];

        try {
            project = await this._projectRepository
                .runCreateQueryBuilder()
                .select("project")
                .from(Project, "project")
                .leftJoinAndSelect("project.Initiator", "initiator")
                .leftJoinAndSelect("initiator.ProfileImage", "profileImage")
                .leftJoinAndSelect("project.Image", "image")
                .leftJoinAndSelect("project.Needs", "needs")
                .leftJoinAndSelect("project.Updates", "updates")
                .where("project.ID = :id", { id })
                .getOne();

            const initiatorId: string = project.Initiator.ID;

            // if email is null then the person making the request is a visitor
            if (!viewerIsVisitor) {
                me                = await this._userService.getByEmail(email);
                fullViewingRights = me.AccountSettings.Role === UserRoleType.Admin ||
                                    me.AccountSettings.Role === UserRoleType.SuperAdmin ||
                                    initiatorId === me.ID;
            }

            otherProjects = await this._projectRepository
                .runCreateQueryBuilder()
                .select("project")
                .from(Project, "project")
                .leftJoinAndSelect("project.Image", "image")
                .leftJoinAndSelect("project.Initiator", "initiator")
                .where("initiator.ID = :initiatorId AND project.ID != :id", { initiatorId, id })
                .getMany();

            otherProjects = otherProjects.filter(p => {

                if (fullViewingRights) {
                    return true;
                }

                if (p.Visibility === VisibilityType.Private && !viewerIsVisitor && initiatorId === me.ID) {
                    return true;
                }

                if (p.Visibility === VisibilityType.Community && !viewerIsVisitor) {
                    return true;
                }

                if (p.Visibility === VisibilityType.Everyone) {
                    return true;
                }

                return false;
            });

            if (!project) {
                throw new Error(this._localizationService.getText("validation.project.non-existent-project"));
            }

        } catch (error) {
            return undefined;
        }

        if (project.Visibility === VisibilityType.Everyone) {
            return new ProjectDTO(project, otherProjects);
        }

        // if the person has admin rights or is the owner of the project then return the project
        if (fullViewingRights) {
            return new ProjectDTO(project, otherProjects);
        }

        if (project.Visibility === VisibilityType.Private) {
            return undefined;
        }

        if (project.Visibility === VisibilityType.Community && viewerIsVisitor) {
            return undefined;
        }

        return new ProjectDTO(project, otherProjects);
    }

    public async getMyProjects(email: string): Promise<MyProjectDTO[]> {
        const dbUser: User = await this._userService.getByEmail(email);

        return dbUser.Projects.map(p => {
            return {
                ID: p.ID,
                Name: p.Name,
                Image: p.Image ? p.Image.Location : "",
                Date: p.Date,
                City: p.City,
                Budget: p.Budget,
                Currency: p.Currency
            } as MyProjectDTO;
        });
    }

    public async getAllProjects(email: string, searchTerm: string, page: number, pageSize: number): Promise<GetAllProjectsResponse> {
        let me: User;
        let fullViewingRights: boolean;
        const viewerIsVisitor: boolean = !email;
        searchTerm = `%${searchTerm.toLowerCase()}%`;

        // if email is null then the person making the request is a visitor
        if (!viewerIsVisitor) {
            me                = await this._userService.getByEmail(email);
            fullViewingRights = me.AccountSettings.Role === UserRoleType.Admin ||
                                me.AccountSettings.Role === UserRoleType.SuperAdmin;
        }

        const projects = await this._projectRepository
            .runCreateQueryBuilder()
            .select("project")
            .from(Project, "project")
            .leftJoinAndSelect("project.Initiator", "initiator")
            .leftJoinAndSelect("project.Image", "image")
            .where("LOWER(project.Name) like :searchTerm OR LOWER(project.Description) like :searchTerm", { searchTerm })
            .getMany();

        const filteredProjects: Project[] = projects
            .filter((p: Project) => {
                if (fullViewingRights) {
                    return true;
                }

                if (p.Visibility === VisibilityType.Private && !viewerIsVisitor && p.Initiator.ID === me.ID) {
                    return true;
                }

                if (p.Visibility === VisibilityType.Community && !viewerIsVisitor) {
                    return true;
                }

                if (p.Visibility === VisibilityType.Everyone) {
                    return true;
                }

                return false;
            });

            const items: ProjectListItem[] = filteredProjects
                .splice(page * pageSize, pageSize)
                .map((p: Project) => {
                    const abstract: string = p.Description.length > 200 ?
                        `${p.Description.substring(0, 200)}...` :
                        p.Description;

                    return {
                        ID: p.ID,
                        Name: p.Name,
                        Image: p.Image ? p.Image.Location : "",
                        Abstract: abstract,
                        InitiatorUsername: p.Initiator.Username,
                        InitiatorName: p.Initiator.Name,
                        City: p.City
                    } as ProjectListItem;
                });

            const pageCount: number = Math.ceil(filteredProjects.length / pageSize);

            return new GetAllProjectsResponse(items, pageCount, page, pageSize);

    }

}
