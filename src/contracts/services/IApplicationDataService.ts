import { Currency, Locale, Skill }      from "../../models";
import { ApplicationTags,
        GeneralApplicationInformation } from "../../dtos";

export interface IApplicationDataService {

    getSkills(): Promise<Skill[]>;

    getLocales(): Promise<Locale[]>;

    getCurrencies(): Promise<Currency[]>;

    getTags(): Promise<ApplicationTags>;

    getGeneralApplicationInformation(): Promise<GeneralApplicationInformation>;
}
