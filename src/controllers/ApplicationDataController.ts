import { inject, injectable }         from "inversify";
import { Request, Response }          from "express";
import { TYPES }                      from "../types";
import { IApplicationDataController } from "./IApplicationDataController";
import { IApplicationDataService }    from "../services/IApplicationDataService";
import { Skill }                      from "../models";

@injectable()
export class ApplicationDataController implements IApplicationDataController {

    private readonly _applicationDataService: IApplicationDataService;

    constructor(@inject(TYPES.ApplicationDataService) applicationDataService: IApplicationDataService) {
        this._applicationDataService = applicationDataService;
    }

    public async getSkills(request: Request, response: Response): Promise<void> {

        const skills: Skill[] = await this._applicationDataService.getSkills();

        response.send(skills);
    }
}
