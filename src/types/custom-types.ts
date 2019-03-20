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
    MessagesController: Symbol("MessagesController"),
    ProjectsController: Symbol("ProjectsController"),
    UsersController: Symbol("UsersController"),
    UserVideosController: Symbol("UserVideosController"),
    WishesController: Symbol("WishesController"),
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
    LocalizationService: Symbol("LocalizationService"),
    MessageService: Symbol("MessageService"),
    ProjectService: Symbol("ProjectService"),
    SkillService: Symbol("SkillService"),
    UserService: Symbol("UserService"),
    UserVideoService: Symbol("UserVideoService"),
    WishService: Symbol("WishService"),
    EmailService: Symbol("EmailService"),
    AwardRepository: Symbol("AwardRepository"),
    EducationRepository: Symbol("EducationRepository"),
    EntityCategoryRepository: Symbol("EntityCategoryRepository"),
    ExperienceRepository: Symbol("ExperienceRepository"),
    LocaleRepository: Symbol("LocaleRepository"),
    MessageRepository: Symbol("MessageRepository"),
    ProfessionalRepository: Symbol("ProfessionalRepository"),
    ProfessionalSkillRepository: Symbol("ProfessionalSkillRepository"),
    ProjectRepository: Symbol("ProjectRepository"),
    SkillRepository: Symbol("SkillRepository"),
    UserAccountSettingsRepository: Symbol("UserAccountSettingsRepository"),
    UserImageRepository: Symbol("UserImageRepository"),
    UserSocialMediaRepository: Symbol("UserSocialMediaRepository"),
    UserRepository: Symbol("UserRepository"),
    UserVideoRepository: Symbol("UserVideoRepository"),
    WishRepository: Symbol("WishRepository")
};

export { TYPES };
