import { inject, injectable }   from "inversify";
import { TYPES }                from "../types";
import { ILocalizationService,
        IProjectService,
        IProjectRepository,
        IUserService }          from "../contracts";
import { BaseService }          from "./BaseService";
import { Project, ProjectNeed,
                  User }        from "../models";
import { CreateProjectDTO }     from "../dtos/projects";

@injectable()
export class ProjectService extends BaseService<Project> implements IProjectService {

    private readonly _userService: IUserService;

    constructor(@inject(TYPES.ProjectRepository) projectRepository: IProjectRepository,
                    @inject(TYPES.LocalizationService) localizationService: ILocalizationService,
                    @inject(TYPES.UserService) userService: IUserService) {
        super(projectRepository, localizationService);

        this._userService = userService;
    }

    public async createProject(email: string, createProjectDTO: CreateProjectDTO): Promise<void> {
        const dbUser: User = await this._userService.getByEmail(email);

        const project: Project = {
            Name: createProjectDTO.Name,
            Description: createProjectDTO.Description,
            Date: createProjectDTO.Date,
            Budget: createProjectDTO.Budget,
            Currency: createProjectDTO.Currency,
            City: createProjectDTO.City,
            Initiator: dbUser
        } as Project;

        if (createProjectDTO.Needs) {
            const needs: ProjectNeed[] = typeof createProjectDTO.Needs === "string" ?
                                                    JSON.parse(createProjectDTO.Needs) : createProjectDTO.Needs;

            needs.forEach((n: ProjectNeed ) => {
                const need: ProjectNeed = {
                    Description: n.Description
                } as ProjectNeed;

                project.Needs.push(need);
            });
        }

        await this.create(project);
    }

}
