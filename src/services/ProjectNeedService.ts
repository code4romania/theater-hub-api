import { inject, injectable }   from "inversify";
import { TYPES }                from "../types";
import {
    IProjectNeedService,
    ILocalizationService,
    IProjectService,
    IUserService,
    IProjectNeedRepository }    from "../contracts";
import { BaseService }          from "./BaseService";
import { Project, ProjectNeed,
                         User } from "../models";
import { CreateProjectNeedDTO,
    UpdateProjectNeedDTO }      from "../dtos";

@injectable()
export class ProjectNeedService extends BaseService<ProjectNeed> implements IProjectNeedService {

    private readonly _projectService: IProjectService;
    private readonly _userService: IUserService;

    constructor(@inject(TYPES.ProjectNeedRepository) projectNeedRepository: IProjectNeedRepository,
                        @inject(TYPES.LocalizationService) localizationService: ILocalizationService,
                        @inject(TYPES.ProjectService) projectService: IProjectService,
                        @inject(TYPES.UserService) userService: IUserService) {
        super(projectNeedRepository, localizationService);
        this._projectService = projectService;
        this._userService       = userService;
    }

    public async createProjectNeed(projectID: string, createProjectNeedDTO: CreateProjectNeedDTO): Promise<ProjectNeed> {
        const dbProject: Project = await this._projectService.getByID(projectID);

        const projectNeed: ProjectNeed = {
            Description: createProjectNeedDTO.Description,
            IsMandatory: createProjectNeedDTO.IsMandatory,
            Project: dbProject
        } as ProjectNeed;

        return this._repository.insert(projectNeed);

    }

    public async updateProjectNeed(email: string, updateProjectNeedDTO: UpdateProjectNeedDTO): Promise<ProjectNeed> {
        const dbUser: User                  = await this._userService.getByEmail(email);
        const dbProject: Project            = dbUser.Projects.find(p => p.ID === updateProjectNeedDTO.ProjectID);
        const dbProjectNeed: ProjectNeed    = dbProject.Needs.find(n => n.ID === updateProjectNeedDTO.ID);

        if (!dbProjectNeed) {
            throw new Error(this._localizationService.getText("validation.project.need.non-existent"));
        }

        dbProjectNeed.Description = updateProjectNeedDTO.Description;
        dbProjectNeed.IsMandatory = updateProjectNeedDTO.IsMandatory;

        return this._repository.update(dbProjectNeed);

    }

    public async deleteProjectNeedByID(email: string, projectID: string, projectNeedID: string): Promise<ProjectNeed> {
        const dbUser: User              = await this._userService.getByEmail(email);
        const dbProject: Project        = dbUser.Projects.find(p => p.ID === projectID);
        const isValidRequest: boolean   = dbProject &&
                                            dbProject.Needs.some(n => n.ID === projectNeedID);

        if (!isValidRequest) {
            throw new Error(this._localizationService.getText("validation.project.need.non-existent"));
        }

        return this._repository.deleteByID(projectNeedID);

    }

}
