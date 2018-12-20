import { Request, Response }   from "express";

export interface IApplicationDataController {

    getSkills(req: Request, res: Response): Promise<void>;

}
