import { inject, injectable }                   from "inversify";
import { TYPES }                                from "../types";
const { check }                                 = require("express-validator/check");
import { User }                                 from "../models/User";
import { IAdministrationRoutesValidators,
        ILocalizationService, IUserService }    from "../contracts";
import { UserAccountStatusType, UserRoleType }  from "../enums";

@injectable()
export class AdministrationRoutesValidators implements IAdministrationRoutesValidators {

    private readonly _userService: IUserService;
    private readonly _localizationService: ILocalizationService;

    constructor(@inject(TYPES.UserService) userService: IUserService,
            @inject(TYPES.LocalizationService) localizationService: ILocalizationService) {
        this._userService           = userService;
        this._localizationService   = localizationService;
    }

    public getInviteUserValidators() {

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
                    const adminUser: User   = await this._userService.getByEmail(req.Principal.Email);
                    const dbUser: User      = await this._userService.getByEmail(value);

                    this._localizationService.setLocale(req.Locale);

                    if (!adminUser || adminUser.AccountSettings.Role === UserRoleType.User) {
                        return Promise.reject(this._localizationService.getText("validation.permissions.not-admin"));
                    }

                    if (adminUser.AccountSettings.Role === UserRoleType.Admin && req.body.Role !== UserRoleType.User) {
                        return Promise.reject(this._localizationService.getText("validation.permissions.insufficient-permissions"));
                    }

                    if (adminUser.AccountSettings.Role === UserRoleType.SuperAdmin && req.body.Role === UserRoleType.SuperAdmin) {
                        return Promise.reject(this._localizationService.getText("validation.permissions.insufficient-permissions"));
                    }

                    if (dbUser && dbUser.AccountSettings.AccountStatus !== UserAccountStatusType.Managed) {
                        return Promise.reject(this._localizationService.getText("validation.email.in-use"));
                    }
            })
        ];
    }

}
