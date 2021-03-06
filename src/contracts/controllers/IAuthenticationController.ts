import { Request, Response }   from "express";

export interface IAuthenticationController {

    authenticate(request: Request, response: Response): Promise<void>;

    facebookAuthenticate(request: Request, response: Response): Promise<void>;

    googleAuthenticate(request: Request, response: Response): Promise<void>;

    checkUserPassword(request: Request, response: Response): Promise<void>;

}
