import { inject, injectable }               from "inversify";
import { TYPES }                            from "../types";
import { IApplicationDataService,
     ISkillService,
     ICurrencyRepository,
     IProjectTagCategoryRepository,
     IProjectNeedTagCategoryRepository,
     ILocaleRepository }                    from "../contracts";
import { Currency, Skill, Locale,
    ProjectTagCategory,
    ProjectNeedTagCategory }                from "../models";
import { ApplicationTags,
         GeneralApplicationInformation }    from "../dtos";

const config    = require("../config/env").getConfig();


@injectable()
export class ApplicationDataService implements IApplicationDataService {

    private readonly _localeRepository: ILocaleRepository;
    private readonly _currencyRepository: ICurrencyRepository;
    private readonly _projectTagCategoryRepository: IProjectTagCategoryRepository;
    private readonly _projectNeedTagCategoryRepository: IProjectNeedTagCategoryRepository;
    private readonly _skillService: ISkillService;

    constructor(
        @inject(TYPES.LocaleRepository) localeRepository: ILocaleRepository,
        @inject(TYPES.CurrencyRepository) currencyRepository: ICurrencyRepository,
        @inject(TYPES.ProjectTagCategoryRepository) projectTagCategoryRepository: IProjectTagCategoryRepository,
        @inject(TYPES.ProjectNeedTagCategoryRepository) projectNeedTagCategoryRepository: IProjectNeedTagCategoryRepository,
        @inject(TYPES.SkillService) skillService: ISkillService) {

        this._localeRepository                  = localeRepository;
        this._currencyRepository                = currencyRepository;
        this._projectTagCategoryRepository      = projectTagCategoryRepository;
        this._projectNeedTagCategoryRepository  = projectNeedTagCategoryRepository;
        this._skillService                      = skillService;
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

    public async getProjectTags(): Promise<ProjectTagCategory[]> {

        const tags: ProjectTagCategory[] = await this._projectTagCategoryRepository.getAll();

        return tags;
    }

    public async getProjectNeedTags(): Promise<ProjectNeedTagCategory[]> {

        const tags: ProjectNeedTagCategory[] = await this._projectNeedTagCategoryRepository.getAll();

        return tags;
    }

    public async getTags(): Promise<ApplicationTags> {

        const projectTags: ProjectTagCategory[]         = await this._projectTagCategoryRepository.getAll();
        const projectNeedTags: ProjectNeedTagCategory[] = await this._projectNeedTagCategoryRepository.getAll();

        const applicationTags: ApplicationTags = {
            ProjectTags: projectTags,
            ProjectNeedTags: projectNeedTags
        } as ApplicationTags;

        return applicationTags;
    }

    public async getGeneralApplicationInformation(): Promise<GeneralApplicationInformation> {

        const generalApplicationInformation: GeneralApplicationInformation = {
            MaxFileSize: config.application.maxFileSize,
            MaxPhotoGalleryFileCount: config.application.maxPhotoGalleryFileCount
        } as GeneralApplicationInformation;

        return generalApplicationInformation;

    }

}
