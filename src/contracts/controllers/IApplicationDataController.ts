import { Request, Response }   from "express";

export interface IApplicationDataController {

    getSkills(req: Request, res: Response): Promise<void>;

    getLocales(req: Request, res: Response): Promise<void>;

    getCurrencies(req: Request, res: Response): Promise<void>;

    getGeneralApplicationInformation(req: Request, res: Response): Promise<void>;

}
