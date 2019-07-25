import { getRepository, Repository }       from "typeorm";
import { injectable }                      from "inversify";
import { Education }                       from "../models/Education";
import { BaseRepository }                  from "./BaseRepository";
import { IEducationRepository }            from "../contracts";

@injectable()
export class EducationRepository extends BaseRepository<Education> implements IEducationRepository {

    private readonly _educationRepository: Repository<Education>;

    constructor() {
        super(getRepository(Education));
        this._educationRepository = getRepository(Education);
    }

}
