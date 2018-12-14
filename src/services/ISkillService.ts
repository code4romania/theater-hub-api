import { Skill }        from "../models/Skill";

export interface ISkillService {
    getAll(): Promise<Skill[]>;

    getByID(id: string): Promise<Skill>;

    getByIDs(ids: string[]): Promise<Skill[]>;

}
