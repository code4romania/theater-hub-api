import { getRepository, Repository }       from "typeorm";
import { injectable }                      from "inversify";
import { UserVideo }                       from "../models/UserVideo";
import { BaseRepository }                  from "./BaseRepository";
import { IUserVideoRepository }            from "./IUserVideoRepository";

@injectable()
export class UserVideoRepository extends BaseRepository<UserVideo> implements IUserVideoRepository {

    private readonly _userVideoRepository: Repository<UserVideo>;

    constructor() {
        super(getRepository(UserVideo));
        this._userVideoRepository = getRepository(UserVideo);
    }

}
