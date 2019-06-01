import { inject, injectable }         from "inversify";
import { Request, Response }          from "express";
import { TYPES }                      from "../types";
import { IApplicationDataController } from "./IApplicationDataController";
import { IApplicationDataService }    from "../services/IApplicationDataService";
import { ILocalizationService }       from "../services/ILocalizationService";
import { Skill }                      from "../models";

@injectable()
export class ApplicationDataController implements IApplicationDataController {

    private readonly _applicationDataService: IApplicationDataService;
    private readonly _localizationService: ILocalizationService;

    constructor(@inject(TYPES.ApplicationDataService) applicationDataService: IApplicationDataService,
                @inject(TYPES.LocalizationService) localizationService: ILocalizationService) {
        this._applicationDataService = applicationDataService;
        this._localizationService    = localizationService;
    }

    public async getSkills(request: Request, response: Response): Promise<void> {

        const skills: Skill[] = await this._applicationDataService.getSkills();

        response.send(skills);
    }

    public async getLocales(request: Request, response: Response): Promise<void> {

        const locales = await this._applicationDataService.getLocales();

        response.send(locales);

    }

    public async getGeneralApplicationInformation(request: Request, response: Response): Promise<void> {

        const generalApplicationInformation = await this._applicationDataService.getGeneralApplicationInformation();

        response.send(generalApplicationInformation);

    }

}
