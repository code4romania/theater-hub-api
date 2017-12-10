import { inject, injectable }  from "inversify";
import { Request, Response }   from "express";
import chalk                   from "chalk";
import * as uuid               from "uuid/v4";
import { TYPES }               from "../types";
import { Project }             from "../models/Project";
import { IProjectsController } from "./IProjectsController";
import { BaseApiController }   from "./BaseApiController";
import { IProjectService }     from "../services";
import { Validators }          from "../utils";

@injectable()
export class ProjectsController extends BaseApiController<Project> implements IProjectsController {

    private readonly _projectService: IProjectService;

    constructor(@inject(TYPES.ProjectService) projectService: IProjectService) {
        super(projectService);
        this._projectService = projectService;
    }

}