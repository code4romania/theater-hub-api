import { Locale, Skill } from "../models";

export interface IApplicationDataService {

    getSkills(): Promise<Skill[]>;

    getLocales(): Promise<Locale[]>;
}
