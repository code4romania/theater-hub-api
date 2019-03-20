import { inject, injectable }              from "inversify";
import { TYPES }                           from "../types";
import { User }                            from "../models/User";
import { IAuthenticationService }          from "../services";
import { ILocalizationService }            from "../services";
import { IAuthenticationRoutesValidators } from "./IAuthenticationRoutesValidators";
import { Validators }                      from "../utils";
const { check }                            = require("express-validator/check");

@injectable()
export class AuthenticationRoutesValidators implements IAuthenticationRoutesValidators {

    private readonly _authenticationService: IAuthenticationService;
    private readonly _localizationService: ILocalizationService;

    constructor(@inject(TYPES.AuthenticationService) authenticationService: IAuthenticationService,
        @inject(TYPES.LocalizationService) localizationService: ILocalizationService) {
        this._authenticationService     = authenticationService;
        this._localizationService       = localizationService;
    }

    public getAuthenticateValidators() {

        return [
            check("Email").not().isEmpty().withMessage((value: string, { req }: any) => {
                    return this._localizationService.getText("validation.email.required", req.Locale);
                })
                .isLength({ max: 100 }).withMessage((value: string, { req }: any) => {
                    return this._localizationService.getText("validation.email.length", req.Locale);
                })
                .isEmail().withMessage((value: string, { req }: any) => {
                    return this._localizationService.getText("validation.email.invalid", req.Locale);
                })
                .custom(async (value: string, { req }: any) => {

                    const isPasswordCorrect: boolean
                                = await this._authenticationService.areValidCredentials(value, req.body.Password);

                    if (!isPasswordCorrect) {
                        return Promise.reject(this._localizationService.getText("validation.credentials.invalid", req.Locale));
                    }
                }),
            check("Password").not().isEmpty().withMessage((value: string, { req }: any) => {
                    return this._localizationService.getText("validation.password.required", req.Locale);
                })
                .custom((value: string, { req }: any) => {
                    if (!Validators.isValidPassword(value)) {
                        throw new Error(this._localizationService.getText("validation.password.invalid", req.Locale));
                    }

                    return true;
                })
        ];
    }

    public getCheckUserPasswordValidators() {

        return [
           check("Password").not().isEmpty().withMessage((value: string, { req }: any) => {
                this._localizationService.setLocale(req.Locale);
                return this._localizationService.getText("validation.password.required");
            })
            .custom(async (value: string, { req }: any) => {
                this._localizationService.setLocale(req.Locale);

                if (!Validators.isValidPassword(value)) {
                    return Promise.reject(this._localizationService.getText("validation.password.invalid"));
                }

                const isValidPassword: boolean = await this._authenticationService.areValidCredentials(req.Principal.Email, value);

                if (!isValidPassword) {
                    return Promise.reject(this._localizationService.getText("validation.password.incorrect"));
                }

                return true;
            })
       ];
   }

}
