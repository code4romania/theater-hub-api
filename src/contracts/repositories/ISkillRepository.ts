import { Skill } from "../../models/Skill";

export interface ISkillRepository {

    getAll(): Promise<Skill[]>;

    getByID(id: string): Promise<Skill>;

    getByIDs(ids: string[]): Promise<Skill[]>;
}
