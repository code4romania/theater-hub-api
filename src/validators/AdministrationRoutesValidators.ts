import { inject, injectable }                   from "inversify";
import { TYPES }                                from "../types";
const { check }                                 = require("express-validator/check");
import { User }                                 from "../models/User";
import { IAdministrationRoutesValidators }      from "./IAdministrationRoutesValidators";
import { IUserService }                         from "../services";
import { UserAccountStatusType, UserRoleType }  from "../enums";
import { Validators }                           from "../utils";

@injectable()
export class AdministrationRoutesValidators implements IAdministrationRoutesValidators {

    private readonly _userService: IUserService;

    constructor(@inject(TYPES.UserService) userService: IUserService) {
        this._userService = userService;
    }

    public getInviteUserValidators() {

        return [
            check("Email").not().isEmpty().withMessage("E-mail is required")
                          .isLength({ max: 100 }).withMessage("E-mail should have at most 100 characters")
                          .isEmail().withMessage("E-mail must be valid")
                          .custom(async (value: string, { req }: any) => {
                                const adminUser: User   = await this._userService.getByEmail(req.Principal.Email);
                                const dbUser: User      = await this._userService.getByEmail(value);

                                if (!adminUser || adminUser.AccountSettings.Role === UserRoleType.User) {
                                    return Promise.reject("Invalid admin account");
                                }

                                if (adminUser.AccountSettings.Role === UserRoleType.Admin && req.body.Role !== UserRoleType.User) {
                                    return Promise.reject("Insufficient permissions.");
                                }

                                if (adminUser.AccountSettings.Role === UserRoleType.SuperAdmin && req.body.Role === UserRoleType.SuperAdmin) {
                                    return Promise.reject("Insufficient permissions.");
                                }

                                if (dbUser && dbUser.AccountSettings.AccountStatus !== UserAccountStatusType.Managed) {
                                    return Promise.reject("E-mail already in use");
                                }
                              })
        ];
    }


}
