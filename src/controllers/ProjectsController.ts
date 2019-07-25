import { inject, injectable }  from "inversify";
import { TYPES }               from "../types";
import { Project }             from "../models/Project";
import { IProjectsController,
         IProjectService }     from "../contracts";
import { BaseApiController }   from "./BaseApiController";

@injectable()
export class ProjectsController extends BaseApiController<Project> implements IProjectsController {

    private readonly _projectService: IProjectService;

    constructor(@inject(TYPES.ProjectService) projectService: IProjectService) {
        super(projectService);
        this._projectService = projectService;
    }

}