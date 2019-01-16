import { Request, Response, NextFunction } from "express";
import { validationResult }                from "express-validator/check";
import { UserRoleType }                    from "../enums";
const config                               = require("../config/env").getConfig();
const jwt                                  = require("jsonwebtoken");

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
            message: "Token is invalid"
        }]});
    }

    token = token.replace("Bearer ", "");

    jwt.verify(token, config.application.tokenSecret, (err: any, decoded: any) => {
        if (err) {
            return response.status(401).json({ errors: {
                field:   "token",
                message: "Token is invalid"
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

export function checkUserRoleMiddleware(role: UserRoleType) {

    return (request: Request, response: Response, next: NextFunction) => {
        if (!request.Principal || request.Principal.Role !== role) {
            return response.status(401).json("Permission denied.");
        }

        next();
    };
}
