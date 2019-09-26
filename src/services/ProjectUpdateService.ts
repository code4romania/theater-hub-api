import { inject, injectable }       from "inversify";
import { TYPES }                    from "../types";
import {
    IProjectUpdateService,
    ILocalizationService,
    IProjectService,
    IUserService,
    IProjectUpdateRepository }      from "../contracts";
import { BaseService }              from "./BaseService";
import { Project, ProjectUpdate,
                    User }          from "../models";
import { CreateProjectUpdateDTO,
    UpdateProjectUpdateDTO }        from "../dtos";

@injectable()
export class ProjectUpdateService extends BaseService<ProjectUpdate> implements IProjectUpdateService {

    private readonly _projectService: IProjectService;
    private readonly _userService: IUserService;

    constructor(@inject(TYPES.ProjectUpdateRepository) projectUpdateRepository: IProjectUpdateRepository,
                        @inject(TYPES.LocalizationService) localizationService: ILocalizationService,
                        @inject(TYPES.ProjectService) projectService: IProjectService,
                        @inject(TYPES.UserService) userService: IUserService) {
        super(projectUpdateRepository, localizationService);
        this._projectService    = projectService;
        this._userService       = userService;
    }

    public async createProjectUpdate(projectID: string, createProjectUpdateDTO: CreateProjectUpdateDTO): Promise<ProjectUpdate> {
        const dbProject: Project = await this._projectService.getByID(projectID);

        const projectUpdate: ProjectUpdate = {
            Description: createProjectUpdateDTO.Description,
            Project: dbProject
        } as ProjectUpdate;

        return this._repository.insert(projectUpdate);

    }

    public async updateProjectUpdate(email: string, updateProjectUpdateDTO: UpdateProjectUpdateDTO): Promise<ProjectUpdate> {
        const dbUser: User                      = await this._userService.getByEmail(email);
        const dbProject: Project                = dbUser.Projects.find(p => p.ID === updateProjectUpdateDTO.ProjectID);
        const dbProjectUpdate: ProjectUpdate    = dbProject.Updates.find(n => n.ID === updateProjectUpdateDTO.ID);

        if (!dbProjectUpdate) {
            throw new Error(this._localizationService.getText("validation.project.update.non-existent"));
        }

        dbProjectUpdate.Description = updateProjectUpdateDTO.Description;

        return this._repository.update(dbProjectUpdate);

    }

    public async deleteProjectUpdateByID(email: string, projectID: string, projectUpdateID: string): Promise<ProjectUpdate> {
        const dbUser: User              = await this._userService.getByEmail(email);
        const dbProject: Project        = dbUser.Projects.find(p => p.ID === projectID);
        const isValidRequest: boolean   = dbProject &&
                                            dbProject.Updates.some(n => n.ID === projectUpdateID);

        if (!isValidRequest) {
            throw new Error(this._localizationService.getText("validation.project.update.non-existent"));
        }

        return this._repository.deleteByID(projectUpdateID);

    }

}
