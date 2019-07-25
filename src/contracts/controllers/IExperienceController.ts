import { IBaseApiController }   from "./IBaseApiController";
import { Request, Response }    from "express";

export interface IExperienceController extends IBaseApiController {

    deleteByID(request: Request, response: Response): Promise<void>;
}
