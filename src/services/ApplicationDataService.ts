import { inject, injectable }      from "inversify";
import { TYPES }                   from "../types";
import { IApplicationDataService,
     ISkillService }               from ".";
import { ILocaleRepository }       from "../repositories";
import { Skill, Locale }           from "../models";


@injectable()
export class ApplicationDataService implements IApplicationDataService {

    private readonly _localeRepository: ILocaleRepository;
    private readonly _skillService: ISkillService;

    constructor(
        @inject(TYPES.LocaleRepository) localeRepository: ILocaleRepository,
        @inject(TYPES.SkillService) skillService: ISkillService) {

        this._localeRepository  = localeRepository;
        this._skillService      = skillService;
    }

    public async getSkills(): Promise<Skill[]> {

        const skills: Skill[] = await this._skillService.getAll();

        return skills;

    }

    public async getLocales(): Promise<Locale[]> {

        const locales: Locale[] = await this._localeRepository.getAll();

        return locales;

    }

}
