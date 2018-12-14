import { inject, injectable }  from "inversify";
import { TYPES }               from "../types";
import { ISkillService }       from "./ISkillService";
import { Skill }               from "../models/Skill";
import { ISkillRepository }    from "../repositories";

@injectable()
export class SkillService implements ISkillService {

    private readonly _skillRepository: ISkillRepository;

    constructor(@inject(TYPES.SkillRepository) skillRepository: ISkillRepository) {
        this._skillRepository = skillRepository;
    }

    public async getAll(): Promise<Skill[]> {
        return this._skillRepository.getAll();
    }

    public async getByID(id: string): Promise<Skill> {
        return this._skillRepository.getByID(id);
    }

    public async getByIDs(ids: string[]): Promise<Skill[]> {
        return this._skillRepository.getByIDs(ids);
    }

}
