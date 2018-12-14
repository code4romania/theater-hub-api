import { getRepository, Repository }       from "typeorm";
import { injectable }                      from "inversify";
import { UserAccountSettings }             from "../models/UserAccountSettings";
import { BaseRepository }                  from "./BaseRepository";
import { IUserAccountSettingsRepository }  from "./IUserAccountSettingsRepository";

@injectable()
export class UserAccountSettingsRepository extends BaseRepository<UserAccountSettings> implements IUserAccountSettingsRepository {

    private readonly _userAccountSettingsRepository: Repository<UserAccountSettings>;

    constructor() {
        super(getRepository(UserAccountSettings));
        this._userAccountSettingsRepository = getRepository(UserAccountSettings);
    }

}
