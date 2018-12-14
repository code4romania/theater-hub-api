import { Request, Response }   from "express";

export interface IAuthenticationController {

    authenticate(request: Request, response: Response): Promise<void>;

}
