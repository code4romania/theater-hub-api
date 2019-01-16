import { IBaseApiController }   from "./IBaseApiController";
import { Request, Response }    from "express";

export interface IAwardsController extends IBaseApiController {

    deleteByID(request: Request, response: Response): Promise<void>;
}
