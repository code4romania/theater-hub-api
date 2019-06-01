import { inject, injectable }               from "inversify";
import { TYPES }                            from "../types";
import { IApplicationDataService,
     ISkillService }                        from ".";
import { ILocaleRepository }                from "../repositories";
import { Skill, Locale }                    from "../models";
import { GeneralApplicationInformation }    from "../dtos";

const config    = require("../config/env").getConfig();


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

    public async getGeneralApplicationInformation(): Promise<GeneralApplicationInformation> {

        const generalApplicationInformation: GeneralApplicationInformation = {
            MaxFileSize: config.application.maxFileSize,
            MaxPhotoGalleryFileCount: config.application.maxPhotoGalleryFileCount
        } as GeneralApplicationInformation;

        return generalApplicationInformation;

    }

}
