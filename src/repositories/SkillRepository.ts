import { getRepository, Repository }       from "typeorm";
import { injectable }                      from "inversify";
import { Skill }                           from "../models/Skill";
import { ISkillRepository }                from "../contracts";

@injectable()
export class SkillRepository implements ISkillRepository {

    private readonly _skillRepository: Repository<Skill>;

    constructor() {
        this._skillRepository = getRepository(Skill);
    }

    public async getAll(): Promise<Skill[]> {
        return await this._skillRepository.find();
    }

    public async getByID(id: string): Promise<Skill> {
        return await this._skillRepository.findOne(id);
    }

    public async getByIDs(ids: string[]): Promise<Skill[]> {
        return await this._skillRepository.findByIds(ids);
    }
}
