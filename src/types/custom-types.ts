import { Principal }    from "../principal";
import { LocaleType } from "../enums";

declare global {
  namespace Express {
    interface Request {
      Principal: Principal;
      Locale: LocaleType;
    }
  }
}

const TYPES = {
    AdministrationController: Symbol("AdministrationController"),
    ApplicationDataController: Symbol("ApplicationDataController"),
    AuthenticationController: Symbol("AuthenticationController"),
    AwardsController: Symbol("AwardsController"),
    EducationController: Symbol("EducationController"),
    ExperienceController: Symbol("ExperienceController"),
    ProjectNeedsController: Symbol("ProjectNeedsController"),
    ProjectsController: Symbol("ProjectsController"),
    ProjectUpdatesController: Symbol("ProjectUpdateController"),
    UsersController: Symbol("UsersController"),
    UserVideosController: Symbol("UserVideosController"),
    AdministrationRoutesValidators: Symbol("AdministrationRoutesValidators"),
    AuthenticationRoutesValidators: Symbol("AuthenticationRoutesValidators"),
    EntitiesValidators: Symbol("EntitiesValidators"),
    ProjectRoutesValidators: Symbol("ProjectRoutesValidators"),
    UserRoutesValidators: Symbol("UserRoutesValidators"),
    AdministrationService: Symbol("AdministrationService"),
    ApplicationDataService: Symbol("ApplicationDataService"),
    AuthenticationService: Symbol("AuthenticationService"),
    AwardService: Symbol("AwardService"),
    EducationService: Symbol("EducationService"),
    ExperienceService: Symbol("ExperienceService"),
    FileService: Symbol("FileService"),
    LocalizationService: Symbol("LocalizationService"),
    ProjectNeedService: Symbol("ProjectNeedService"),
    ProjectService: Symbol("ProjectService"),
    ProjectUpdateService: Symbol("ProjectUpdateService"),
    SkillService: Symbol("SkillService"),
    UserService: Symbol("UserService"),
    UserVideoService: Symbol("UserVideoService"),
    EmailService: Symbol("EmailService"),
    AwardRepository: Symbol("AwardRepository"),
    EducationRepository: Symbol("EducationRepository"),
    EntityCategoryRepository: Symbol("EntityCategoryRepository"),
    ExperienceRepository: Symbol("ExperienceRepository"),
    LocaleRepository: Symbol("LocaleRepository"),
    CurrencyRepository: Symbol("CurrencyRepository"),
    ProfessionalRepository: Symbol("ProfessionalRepository"),
    ProfessionalSkillRepository: Symbol("ProfessionalSkillRepository"),
    ProjectNeedRepository: Symbol("ProjectNeedRepository"),
    ProjectRepository: Symbol("ProjectRepository"),
    ProjectNeedTagCategoryRepository: Symbol("ProjectNeedTagCategoryRepository"),
    ProjectNeedTagRepository: Symbol("ProjectNeedTagRepository"),
    ProjectTagCategoryRepository: Symbol("ProjectTagCategoryRepository"),
    ProjectTagRepository: Symbol("ProjectTagRepository"),
    ProjectUpdateRepository: Symbol("ProjectUpdateRepository"),
    SkillRepository: Symbol("SkillRepository"),
    ProjectImageRepository: Symbol("ProjectImageRepository"),
    UserAccountSettingsRepository: Symbol("UserAccountSettingsRepository"),
    UserFileRepository: Symbol("UserFileRepository"),
    UserImageRepository: Symbol("UserImageRepository"),
    UserSocialMediaRepository: Symbol("UserSocialMediaRepository"),
    UserRepository: Symbol("UserRepository"),
    UserVideoRepository: Symbol("UserVideoRepository")
};

export { TYPES };
