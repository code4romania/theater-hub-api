import { getRepository, Repository }       from "typeorm";
import { injectable }                      from "inversify";
import { UserSocialMedia }                 from "../models/UserSocialMedia";
import { BaseRepository }                  from "./BaseRepository";
import { IUserSocialMediaRepository }      from "../contracts";

@injectable()
export class UserSocialMediaRepository extends BaseRepository<UserSocialMedia> implements IUserSocialMediaRepository {

    private readonly _userSocialMediaRepository: Repository<UserSocialMedia>;

    constructor() {
        super(getRepository(UserSocialMedia));
        this._userSocialMediaRepository = getRepository(UserSocialMedia);
    }

}
