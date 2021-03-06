import { inject, injectable }         from "inversify";
import { Request, Response }          from "express";
import { TYPES }                      from "../types";
import { IApplicationDataController,
         IApplicationDataService }    from "../contracts";
import { Skill }                      from "../models";

@injectable()
export class ApplicationDataController implements IApplicationDataController {

    private readonly _applicationDataService: IApplicationDataService;

    constructor(@inject(TYPES.ApplicationDataService) applicationDataService: IApplicationDataService) {
        this._applicationDataService = applicationDataService;
    }

    public async getSkills(request: Request, response: Response): Promise<void> {

        let skills: Skill[] = await this._applicationDataService.getSkills();

        skills = skills.map(s => {
            return {
                ...s,
                Image: s.Image ? s.Image.toString() : ""
            };
        });

        response.send(skills);
    }

    public async getLocales(request: Request, response: Response): Promise<void> {

        const locales = await this._applicationDataService.getLocales();

        response.send(locales);

    }

    public async getCurrencies(request: Request, response: Response): Promise<void> {

        const currencies = await this._applicationDataService.getCurrencies();

        response.send(currencies);

    }

    public async getTags(request: Request, response: Response): Promise<void> {

        const tags = await this._applicationDataService.getTags();

        response.send(tags);

    }

    public async getGeneralApplicationInformation(request: Request, response: Response): Promise<void> {

        const generalApplicationInformation = await this._applicationDataService.getGeneralApplicationInformation();

        response.send(generalApplicationInformation);

    }

}
