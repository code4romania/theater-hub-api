import { inject, injectable }       from "inversify";
import { Request, Response }        from "express";
import { TYPES }                    from "../types";
import { Project }                  from "../models/Project";
import { IProjectsController,
         IProjectService,
         ILocalizationService }     from "../contracts";
import { BaseApiController }        from "./BaseApiController";
import { CreateProjectDTO,
        ProjectDTO,
        GetAllProjectsResponse }    from "../dtos";

@injectable()
export class ProjectsController extends BaseApiController<Project> implements IProjectsController {

    private readonly _projectService: IProjectService;
    private readonly _localizationService: ILocalizationService;

    constructor(
        @inject(TYPES.ProjectService) projectService: IProjectService,
        @inject(TYPES.LocalizationService) localizationService: ILocalizationService
    ) {
        super(projectService);
        this._projectService        = projectService;
        this._localizationService   = localizationService;
    }

    public async create(request: any, response: Response): Promise<void> {
        const createProjectDTO: CreateProjectDTO = request.body as CreateProjectDTO;

        createProjectDTO.Image = request.file;

        const project: Project = await this._projectService.createProject(request.Principal.Email, createProjectDTO);

        response.send(project);
    }

    public async getByID(request: Request, response: Response): Promise<void> {
        const myEmail: string     = request.Principal ? request.Principal.Email : "";
        const project: ProjectDTO = await this._projectService.getProject(myEmail, request.params.projectID);

        response.send(project);
    }

    public async getAll(request: Request, response: Response): Promise<void> {
        const myEmail: string       = request.Principal ? request.Principal.Email : "";
        const searchTerm: string    = request.query.searchTerm;
        const page: number          = +request.query.page;
        const pageSize: number      = +request.query.pageSize;

        const projects: GetAllProjectsResponse = await this._projectService.getAllProjects(myEmail, searchTerm, page, pageSize);

        response.send(projects);
    }

    public async getRandom(request: Request, response: Response): Promise<void> {
        const count: number = +request.query.count;
        const projects      = await this._projectService.getRandomProjects(count);

        response.send(projects);
    }

    public async deleteByID(request: Request, response: Response): Promise<void> {

        this._projectService.setLocale(request.Locale);

        const project = await this._projectService.deleteProjectByID(request.Principal.Email, request.params.projectID);

        response.send(project);
    }

}
