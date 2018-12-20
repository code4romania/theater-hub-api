import { Skill } from "../models";

export interface IApplicationDataService {

    getSkills(): Promise<Skill[]>;
}
