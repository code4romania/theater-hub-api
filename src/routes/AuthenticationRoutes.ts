import { container }                       from "../config/inversify.config";
import { TYPES }                           from "../types/custom-types";
import { IAuthenticationController }       from "../controllers";
import { IAuthenticationRoutesValidators } from "../validators";
import { authorizationMiddleware,
         validatorMiddleware }             from "../middlewares";
import { Request, Response }               from "express";
import * as passport                       from "passport";

export default (app: any) => {

    const authenticationController: IAuthenticationController               = container.get<IAuthenticationController>(TYPES.AuthenticationController);
    const authenticationRoutesValidators: IAuthenticationRoutesValidators   = container.get<IAuthenticationRoutesValidators>(TYPES.AuthenticationRoutesValidators);

    app.get("/api/authentication/facebook", passport.authenticate("facebook"));

    app.get("/api/authentication/facebook/callback", passport.authenticate("facebook", { successRedirect: "/create-profile", failureRedirect: "/login" }));

    app.post("/api/authentication", authenticationRoutesValidators.getAuthenticateValidators(), validatorMiddleware,
                                                        (req: Request, res: Response) => authenticationController.authenticate(req, res));

    app.post("/api/authentication/password/validity", authorizationMiddleware,
                                    authenticationRoutesValidators.getCheckUserPasswordValidators(), validatorMiddleware,
                                    (req: Request, res: Response) => authenticationController.checkUserPassword(req, res));

};
