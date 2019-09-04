import { inject, injectable }  from "inversify";
import { Request, Response }   from "express";
import { TYPES }               from "../types";
import { Project }             from "../models/Project";
import { IProjectsController,
         IProjectService }     from "../contracts";
import { BaseApiController }   from "./BaseApiController";
import { CreateProjectDTO }    from "../dtos";

@injectable()
export class ProjectsController extends BaseApiController<Project> implements IProjectsController {

    private readonly _projectService: IProjectService;

    constructor(@inject(TYPES.ProjectService) projectService: IProjectService) {
        super(projectService);
        this._projectService = projectService;
    }

    public async create(request: any, response: Response): Promise<void> {
        const createProjectDTO: CreateProjectDTO = request.body as CreateProjectDTO;

        createProjectDTO.Image = request.file;

        const project: Project = await this._projectService.createProject(request.Principal.Email, createProjectDTO);

        response.send(project);
    }

}
