import { Request, Response, NextFunction } from "express";
import { validationResult }                from "express-validator/check";
import { LocaleType, UserRoleType }        from "../enums";
import { ILocalizationService }            from "../contracts";
import { container }                       from "../config/inversify.config";
import { TYPES }                           from "../types/custom-types";
const config                               = require("../config/env").getConfig();
const jwt                                  = require("jsonwebtoken");

const localizationService: ILocalizationService = container.get<ILocalizationService>(TYPES.LocalizationService);

export function setOriginMiddleware(request: Request, response: Response, next: NextFunction) {
    request.headers.origin = config.application.baseURL;
    next();
}

export function validatorMiddleware(request: Request, response: Response, next: NextFunction) {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      const formattedErrors = errors.array({ onlyFirstError: true }).map((e: any) => {

        return {
            field:   e.param,
            message: e.msg
        };

      });

      response.status(400).json({ errors:  formattedErrors});
    } else {
        next();
    }

}

export function authorizationMiddleware(request: Request, response: Response, next: NextFunction) {
    let token: string = request.headers["authorization"];

    if (!token) {

        return response.status(401).json({ errors: [{
            field:   "token",
            message: localizationService.getText("validation.user.token.invalid", request.Locale)
        }]});
    }

    token = token.replace("Bearer ", "");

    jwt.verify(token, config.application.tokenSecret, (err: any, decoded: any) => {
        if (err) {

            return response.status(401).json({ errors: {
                field:   "token",
                message: localizationService.getText("validation.user.token.invalid", request.Locale)
            }});
        }

        request.Principal = {
            FirstName: decoded.firstName,
            LastName: decoded.lastName,
            Email: decoded.email,
            Role: decoded.role,
            AccountStatus: decoded.accountStatus
        };
    });


    next();
}

export function getPrincipalIfRequestHasToken(request: Request, response: Response, next: NextFunction) {
    let token: string = request.headers["authorization"];

    if (!token) {
        return next();
    }

    token = token.replace("Bearer ", "");

    jwt.verify(token, config.application.tokenSecret, (err: any, decoded: any) => {
        if (!err) {
            request.Principal = {
                FirstName: decoded.firstName,
                LastName: decoded.lastName,
                Email: decoded.email,
                Role: decoded.role,
                AccountStatus: decoded.accountStatus
            };
        }
    });

    next();
}

export function getAcceptedLocale(request: Request, response: Response, next: NextFunction) {

    if (request.headers["accept-language"]) {
        request.Locale = (<any>LocaleType)[request.headers["accept-language"].toUpperCase()];
    } else {
        request.Locale = LocaleType.RO;
    }

    next();
}

export function checkUserRoleMiddleware(role: UserRoleType) {

    return (request: Request, response: Response, next: NextFunction) => {
        if (!request.Principal || request.Principal.Role !== role) {
            return response.status(401).json(localizationService.getText("validation.user.permission-denied", request.Locale));
        }

        next();
    };
}
