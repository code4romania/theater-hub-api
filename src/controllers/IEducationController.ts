import { IBaseApiController }   from "./IBaseApiController";
import { Request, Response }    from "express";

export interface IEducationController extends IBaseApiController {

    deleteByID(request: Request, response: Response): Promise<void>;
}
