import { inject, injectable }              from "inversify";
import { Request, Response }               from "express";
import { TYPES }                           from "../types";
import { IAuthenticationService }          from "./IAuthenticationService";
import { LoginRequest, RegisterRequest }   from "../requests";
import { User }                            from "../models";
import { IUserRepository }                 from "../repositories";

@injectable()
export class AuthenticationService implements IAuthenticationService {

    private readonly _userRepository: IUserRepository;

    constructor(@inject(TYPES.UserRepository) userRepository: IUserRepository) {
        this._userRepository = userRepository;
    }

    public async login(request: LoginRequest): Promise<void> {
        return;
    }

}
