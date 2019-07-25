import { container }                       from "../config/inversify.config";
import { TYPES }                           from "../types/custom-types";
import { IAuthenticationController,
        IAuthenticationRoutesValidators }  from "../contracts";
import { authorizationMiddleware,
        validatorMiddleware }              from "../middlewares";
import { Request, Response }               from "express";
import * as passport                       from "passport";

const config = require("../config/env").getConfig();
require("../config/passport");

export default (app: any) => {

    const authenticationController: IAuthenticationController               = container.get<IAuthenticationController>(TYPES.AuthenticationController);
    const authenticationRoutesValidators: IAuthenticationRoutesValidators   = container.get<IAuthenticationRoutesValidators>(TYPES.AuthenticationRoutesValidators);

    app.get("/api/authentication/facebook", passport.authenticate("facebook", { scope: ["email"] }));

    app.get("/api/authentication/facebook/callback",
                passport.authenticate("facebook"), (req: Request, res: Response) => authenticationController.facebookAuthenticate(req, res));

    app.get("/api/authentication/google",
                passport.authenticate("google", { scope: [ "https://www.googleapis.com/auth/plus.login",
                                                    "https://www.googleapis.com/auth/plus.profile.emails.read" ] }));

    app.get("/api/authentication/google/callback",
            passport.authenticate("google"), (req: Request, res: Response) => authenticationController.googleAuthenticate(req, res));

    app.post("/api/authentication", authenticationRoutesValidators.getAuthenticateValidators(), validatorMiddleware,
                                                        (req: Request, res: Response) => authenticationController.authenticate(req, res));

    app.post("/api/authentication/password/validity", authorizationMiddleware,
                                    authenticationRoutesValidators.getCheckUserPasswordValidators(), validatorMiddleware,
                                    (req: Request, res: Response) => authenticationController.checkUserPassword(req, res));

};
