import { inject, injectable }       from "inversify";
import { TYPES }                    from "../types";
import { IProjectService }          from "../services";
import { IProjectRoutesValidators } from "./IProjectRoutesValidators";
const { check }                     = require("express-validator/check");

@injectable()
export class ProjectRoutesValidators implements IProjectRoutesValidators {

    private readonly _projectService: IProjectService;

    constructor(@inject(TYPES.ProjectService) projectService: IProjectService) {
        this._projectService  = projectService;
    }

}
