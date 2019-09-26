import { IBaseApiController }   from "./IBaseApiController";
import { Request, Response }    from "express";

export interface IProjectsController extends IBaseApiController {

    getRandom(request: Request, response: Response): Promise<void>;

    updateGeneralInformation(req: Request, res: Response): Promise<void>;

    deleteByID(request: Request, response: Response): Promise<void>;
}
