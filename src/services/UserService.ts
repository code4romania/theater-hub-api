import { inject, injectable }  from "inversify";
import { TYPES }               from "../types";
import { IUserService }        from "./IUserService";
import { BaseService }         from "./BaseService";
import { User }                from "../models/User";
import { IUserRepository }     from "../repositories";

@injectable()
export class UserService extends BaseService<User> implements IUserService {

    private readonly _userRepository: IUserRepository;

    constructor(@inject(TYPES.UserRepository) userRepository: IUserRepository) {
        super(userRepository);
        this._userRepository = userRepository;
    }

    public async getByEmail(email: string): Promise<User> {
        return this._userRepository.getByEmail(email);
    }
}