import { Request, Response }   from "express";

export interface IAuthenticationController {

    login(request: Request, response: Response): Promise<void>;

}
