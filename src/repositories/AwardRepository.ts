import { getRepository, Repository }       from "typeorm";
import { injectable }                      from "inversify";
import { Award }                           from "../models/Award";
import { BaseRepository }                  from "./BaseRepository";
import { IAwardRepository }                from "./IAwardRepository";

@injectable()
export class AwardRepository extends BaseRepository<Award> implements IAwardRepository {

    private readonly _awardRepository: Repository<Award>;

    constructor() {
        super(getRepository(Award));
        this._awardRepository = getRepository(Award);
    }

}
