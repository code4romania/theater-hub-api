import { inject, injectable }               from "inversify";
import { TYPES }                            from "../types";
import { IApplicationDataService,
     ISkillService,
     ICurrencyRepository,
     ILocaleRepository }                    from "../contracts";
import { Currency, Skill, Locale }          from "../models";
import { GeneralApplicationInformation }    from "../dtos";

const config    = require("../config/env").getConfig();


@injectable()
export class ApplicationDataService implements IApplicationDataService {

    private readonly _localeRepository: ILocaleRepository;
    private readonly _currencyRepository: ICurrencyRepository;
    private readonly _skillService: ISkillService;

    constructor(
        @inject(TYPES.LocaleRepository) localeRepository: ILocaleRepository,
        @inject(TYPES.CurrencyRepository) currencyRepository: ICurrencyRepository,
        @inject(TYPES.SkillService) skillService: ISkillService) {

        this._localeRepository      = localeRepository;
        this._currencyRepository    = currencyRepository;
        this._skillService          = skillService;
    }

    public async getSkills(): Promise<Skill[]> {

        const skills: Skill[] = await this._skillService.getAll();

        return skills;

    }

    public async getLocales(): Promise<Locale[]> {

        const locales: Locale[] = await this._localeRepository.getAll();

        return locales;

    }

    public async getCurrencies(): Promise<Currency[]> {

        const currencies: Currency[] = await this._currencyRepository.getAll();

        return currencies;

    }

    public async getGeneralApplicationInformation(): Promise<GeneralApplicationInformation> {

        const generalApplicationInformation: GeneralApplicationInformation = {
            MaxFileSize: config.application.maxFileSize,
            MaxPhotoGalleryFileCount: config.application.maxPhotoGalleryFileCount
        } as GeneralApplicationInformation;

        return generalApplicationInformation;

    }

}
