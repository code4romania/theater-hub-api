import { getRepository, Repository }       from "typeorm";
import { injectable }                      from "inversify";
import { Professional }                    from "../models/Professional";
import { BaseRepository }                  from "./BaseRepository";
import { IProfessionalRepository }         from "../contracts";

@injectable()
export class ProfessionalRepository extends BaseRepository<Professional> implements IProfessionalRepository {

    private readonly _professionalRepository: Repository<Professional>;

    constructor() {
        super(getRepository(Professional));
        this._professionalRepository = getRepository(Professional);
    }

}
