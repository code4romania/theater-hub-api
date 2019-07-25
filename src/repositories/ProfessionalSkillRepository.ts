import { getRepository, Repository }       from "typeorm";
import { injectable }                      from "inversify";
import { ProfessionalSkill }               from "../models/ProfessionalSkill";
import { BaseRepository }                  from "./BaseRepository";
import { IProfessionalSkillRepository }    from "../contracts";

@injectable()
export class ProfessionalSkillRepository extends BaseRepository<ProfessionalSkill> implements IProfessionalSkillRepository {

    private readonly _professionalSkillRepository: Repository<ProfessionalSkill>;

    constructor() {
        super(getRepository(ProfessionalSkill));
        this._professionalSkillRepository = getRepository(ProfessionalSkill);
    }

}
