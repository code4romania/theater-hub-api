import { inject, injectable }                                  from "inversify";
import { Request, Response }                                   from "express";
import { TYPES }                                               from "../types";
import { IAuthenticationController,
        IAuthenticationService,
        IUserService }                                         from "../contracts";
import { AuthenticationRequestDTO, AuthenticationResponseDTO } from "../dtos";
const config = require("../config/env").getConfig();

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

    public async facebookAuthenticate(request: Request, response: Response): Promise<void> {

        const authenticationRequestDTO: AuthenticationRequestDTO = {
            Email: request.user.Email,
            Password: request.user.Password
        } as AuthenticationRequestDTO;

        const authenticationResponse: AuthenticationResponseDTO = await this._authenticationService.authenticate(authenticationRequestDTO);

        response.redirect(`${config.client.baseURL}/${config.client.endpoints.loginResource}?token=${authenticationResponse.Token}`);
    }

    public async googleAuthenticate(request: Request, response: Response): Promise<void> {

        const authenticationRequestDTO: AuthenticationRequestDTO = {
            Email: request.user.Email,
            Password: request.user.Password
        } as AuthenticationRequestDTO;

        const authenticationResponse: AuthenticationResponseDTO = await this._authenticationService.authenticate(authenticationRequestDTO);

        response.redirect(`${config.client.baseURL}/${config.client.endpoints.loginResource}?token=${authenticationResponse.Token}`);
    }

    public async checkUserPassword(request: Request, response: Response): Promise<void> {

        response.sendStatus(200);
   }

}
