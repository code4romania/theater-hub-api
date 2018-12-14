import { getRepository, Repository }       from "typeorm";
import { injectable }                      from "inversify";
import { UserImage }                       from "../models/UserImage";
import { BaseRepository }                  from "./BaseRepository";
import { IUserImageRepository }            from "./IUserImageRepository";

@injectable()
export class UserImageRepository extends BaseRepository<UserImage> implements IUserImageRepository {

    private readonly _userImageRepository: Repository<UserImage>;

    constructor() {
        super(getRepository(UserImage));
        this._userImageRepository = getRepository(UserImage);
    }

}
