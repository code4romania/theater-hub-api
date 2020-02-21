import { inject, injectable }                                  from "inversify";
import { TYPES }                                               from "../types";
import { IAuthenticationService, IUserService }                from "../contracts";
import { User }                                                 from "../models";
import { AuthenticationRequestDTO, AuthenticationResponseDTO } from "../dtos";
import { UserAccountStatusType }                               from "../enums/UserAccountStatusType";
const bcrypt                                                   = require("bcryptjs");
const config                                                   = require("../config/env").getConfig();
const jwt                                                      = require("jsonwebtoken");

@injectable()
export class AuthenticationService implements IAuthenticationService {

    private readonly _userService: IUserService;

    constructor(@inject(TYPES.UserService) userService: IUserService) {
        this._userService = userService;
    }

    public async authenticate(request: AuthenticationRequestDTO): Promise<AuthenticationResponseDTO> {

        const user: User = await this._userService.getByEmail(request.Email);

        const response: AuthenticationResponseDTO = {
            Token: jwt.sign({
                    firstName: user.Professional.FirstName,
                    lastName: user.Professional.LastName,
                    email: request.Email,
                    role: user.AccountSettings.Role,
                    accountStatus: user.AccountSettings.AccountStatus
                }, config.application.tokenSecret),
            Locale: user.AccountSettings.Locale
        };

        return response;
    }

    public async areValidCredentials(email: string, password: string): Promise<boolean> {

        const user: User = await this._userService.getByEmail(email);

        if (!user ||
            (user.AccountSettings.AccountStatus !== UserAccountStatusType.Confirmed &&
                                            user.AccountSettings.AccountStatus !== UserAccountStatusType.Enabled)) {
            return false;
        }

        const isPasswordCorrect = bcrypt.compareSync(password, user.PasswordHash);

        return isPasswordCorrect;
    }

}
