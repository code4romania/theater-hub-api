import { inject, injectable }                                  from "inversify";
import { Request, Response }                                   from "express";
import { TYPES }                                               from "../types";
import { User }                                                from "../models/User";
import { IAuthenticationController }                           from "./IAuthenticationController";
import { IAuthenticationService, IUserService }                from "../services";
import { AuthenticationRequestDTO, AuthenticationResponseDTO,
                                 CheckUserPasswordRequestDTO } from "../dtos";

@injectable()
export class AuthenticationController implements IAuthenticationController {

    private readonly _authenticationService: IAuthenticationService;
    private readonly _userService: IUserService;

    constructor(@inject(TYPES.AuthenticationService) authenticationService: IAuthenticationService,
                @inject(TYPES.UserService) userService: IUserService) {
        this._authenticationService  = authenticationService;
        this._userService            = userService;
    }

    public async authenticate(request: Request, response: Response): Promise<void> {

        const authenticationRequestDTO: AuthenticationRequestDTO = request.body as AuthenticationRequestDTO;

        const authenticationResponse: AuthenticationResponseDTO = await this._authenticationService.authenticate(authenticationRequestDTO);

        response.send(authenticationResponse);
    }

    public async checkUserPassword(request: Request, response: Response): Promise<void> {

        response.sendStatus(200);
   }

}
