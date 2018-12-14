import { inject, injectable }              from "inversify";
import { TYPES }                           from "../types";
import { User }                            from "../models/User";
import { IAuthenticationService }          from "../services";
import { IAuthenticationRoutesValidators } from "./IAuthenticationRoutesValidators";
import { Validators }                      from "../utils";
const { check }                            = require("express-validator/check");

@injectable()
export class AuthenticationRoutesValidators implements IAuthenticationRoutesValidators {

    private readonly _authenticationService: IAuthenticationService;

    constructor(@inject(TYPES.AuthenticationService) authenticationService: IAuthenticationService) {
        this._authenticationService  = authenticationService;
    }

    public getAuthenticateValidators() {

        return [
            check("Email").not().isEmpty().withMessage("E-mail is required")
                .isLength({ max: 100 }).withMessage("E-mail should have at most 100 characters")
                .isEmail().withMessage("E-mail must be valid")
                .custom(async (value: string, { req }: any) => {
                    const isPasswordCorrect: boolean
                                = await this._authenticationService.areValidCredentials(value, req.body.Password);

                    if (!isPasswordCorrect) {
                        return Promise.reject("Credentials are invalid");
                    }
                }),
            check("Password").not().isEmpty().withMessage("Password is required")
                .custom((value: string) => {
                    if (!Validators.isValidPassword(value)) {
                        throw new Error("Password must be between 7 and 50 characters long and include upper and lowercase characters");
                    }

                    return true;
                })
        ];
    }

}
