import { getRepository, Repository }       from "typeorm";
import { injectable }                      from "inversify";
import { Experience }                      from "../models/Experience";
import { BaseRepository }                  from "./BaseRepository";
import { IExperienceRepository }           from "../contracts";

@injectable()
export class ExperienceRepository extends BaseRepository<Experience> implements IExperienceRepository {

    private readonly _experienceRepository: Repository<Experience>;

    constructor() {
        super(getRepository(Experience));
        this._experienceRepository = getRepository(Experience);
    }

}
