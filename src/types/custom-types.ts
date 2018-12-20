import { Principal } from "../principal";


declare global {
  namespace Express {
    interface Request {
      Principal: Principal;
    }
  }
}

const TYPES = {
    ApplicationDataController: Symbol("ApplicationDataController"),
    AuthenticationController: Symbol("AuthenticationController"),
    MessagesController: Symbol("MessagesController"),
    ProjectsController: Symbol("ProjectsController"),
    UsersController: Symbol("UsersController"),
    WishesController: Symbol("WishesController"),
    AuthenticationRoutesValidators: Symbol("AuthenticationRoutesValidators"),
    ProjectRoutesValidators: Symbol("ProjectRoutesValidators"),
    UserRoutesValidators: Symbol("UserRoutesValidators"),
    ApplicationDataService: Symbol("ApplicationDataService"),
    AuthenticationService: Symbol("AuthenticationService"),
    MessageService: Symbol("MessageService"),
    ProjectService: Symbol("ProjectService"),
    SkillService: Symbol("SkillService"),
    UserService: Symbol("UserService"),
    WishService: Symbol("WishService"),
    EmailService: Symbol("EmailService"),
    AwardRepository: Symbol("AwardRepository"),
    EducationRepository: Symbol("EducationRepository"),
    EntityCategoryRepository: Symbol("EntityCategoryRepository"),
    ExperienceRepository: Symbol("ExperienceRepository"),
    MessageRepository: Symbol("MessageRepository"),
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
