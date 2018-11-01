import { container }                   from "../config/inversify.config";
import { TYPES }                       from "../types/custom-types";
import { IAuthenticationController }   from "../controllers";
import { Request, Response }           from "express";


export default (app: any) => {

    const authenticationController: IAuthenticationController = container.get<IAuthenticationController>(TYPES.AuthenticationController);

    app.post("/api/authentication/login", (req: Request, res: Response) => authenticationController.login(req, res));

};
