import { getRepository, Repository }       from "typeorm";
import { injectable }                      from "inversify";
import { User }                            from "../models/User";
import { BaseRepository }                  from "./BaseRepository";
import { IUserRepository }                 from "./IUserRepository";

@injectable()
export class UserRepository extends BaseRepository<User> implements IUserRepository {

    private readonly _userRepository: Repository<User>;

    constructor() {
        super(getRepository(User));
        this._userRepository = getRepository(User);
    }

    public getByEmail(email: string): Promise<User> {
        return this._userRepository.findOne({ Email: email });
    }

}
