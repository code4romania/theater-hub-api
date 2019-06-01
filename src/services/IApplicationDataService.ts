import { Locale, Skill }                 from "../models";
import { GeneralApplicationInformation } from "../dtos";

export interface IApplicationDataService {

    getSkills(): Promise<Skill[]>;

    getLocales(): Promise<Locale[]>;

    getGeneralApplicationInformation(): Promise<GeneralApplicationInformation>;
}
