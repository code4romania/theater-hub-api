import { IBaseApiController }   from "./IBaseApiController";
import { Request, Response }    from "express";

export interface IProjectUpdatesController extends IBaseApiController {

    deleteByID(request: Request, response: Response): Promise<void>;
}
