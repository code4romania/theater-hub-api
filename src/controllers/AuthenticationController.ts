import { inject, injectable }                      from "inversify";
import { Request, Response }                       from "express";
import { TYPES }                                   from "../types";
import { User }                                    from "../models/User";
import { IAuthenticationController }               from "./IAuthenticationController";
import { IAuthenticationService, IUserService }    from "../services";

@injectable()
export class AuthenticationController implements IAuthenticationController {

    private readonly _authenticationService: IAuthenticationService;
    private readonly _userService: IUserService;

    constructor(@inject(TYPES.AuthenticationService) authenticationService: IAuthenticationService,
                @inject(TYPES.UserService) userService: IUserService) {
        this._authenticationService  = authenticationService;
        this._userService            = userService;
    }

    public async login(request: Request, response: Response): Promise<void> {

        if (!request.params.email || !request.params.password) {
          response.status(400).json("Incorrect login request.");
          response.end();
          return;
        }

        const user: User = await this._userService.getByEmail(request.params.email);

        response.send(user);
    }
}
