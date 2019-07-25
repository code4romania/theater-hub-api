import { getRepository, Repository }       from "typeorm";
import { injectable }                      from "inversify";
import { UserFile }                        from "../models/UserFile";
import { BaseRepository }                  from "./BaseRepository";
import { IUserFileRepository }             from "../contracts";

@injectable()
export class UserFileRepository extends BaseRepository<UserFile> implements IUserFileRepository {

    private readonly _userFileRepository: Repository<UserFile>;

    constructor() {
        super(getRepository(UserFile));
        this._userFileRepository = getRepository(UserFile);
    }

}
