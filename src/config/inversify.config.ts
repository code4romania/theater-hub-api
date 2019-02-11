import { Container }                                                                      from "inversify";
import { TYPES }                                                                          from "../types/custom-types";
import { IAdministrationController, AdministrationController,
    IApplicationDataController, IAuthenticationController,
    IAwardsController, IEducationController, IExperienceController,
    IMessagesController, IProjectsController, IUsersController, IUserVideosController,
    IWishesController, ApplicationDataController, AuthenticationController,
    AwardsController, EducationController, ExperienceController,
    MessagesController,  ProjectsController, UsersController,
    UserVideosController, WishesController }                                             from "../controllers";
import { IAdministrationRoutesValidators, AdministrationRoutesValidators,
         IAuthenticationRoutesValidators, AuthenticationRoutesValidators,
         IEntitiesValidators, EntitiesValidators,
         IProjectRoutesValidators, ProjectRoutesValidators,
         IUserRoutesValidators, UserRoutesValidators }                                    from "../validators";
import { IAdministrationService, IApplicationDataService, IAwardService,
    IEducationService, IExperienceService,
    IMessageService, IProjectService, ISkillService,
    IUserService, IUserVideoService, IWishService, IEmailService,
    AdministrationService, ApplicationDataService, AwardService,
    EducationService, ExperienceService,
    MessageService, ProjectService, SkillService, UserService, UserVideoService,
    WishService, EmailService, IAuthenticationService, AuthenticationService }            from "../services";
import { IAwardRepository, IEducationRepository, IEntityCategoryRepository,
    IExperienceRepository, IMessageRepository, IProfessionalRepository,
    IProfessionalSkillRepository, IProjectRepository,
    ISkillRepository, IUserAccountSettingsRepository,
    IUserImageRepository, IUserSocialMediaRepository,
    IUserRepository, IUserVideoRepository, IWishRepository, AwardRepository,
    EducationRepository, EntityCategoryRepository, ExperienceRepository, MessageRepository,
    ProfessionalRepository, ProfessionalSkillRepository, ProjectRepository,
    SkillRepository, UserAccountSettingsRepository, UserImageRepository,
    UserSocialMediaRepository, UserRepository, UserVideoRepository, WishRepository}       from "../repositories";

const container = new Container();

container.bind<IAdministrationController>(TYPES.AdministrationController).to(AdministrationController);
container.bind<IApplicationDataController>(TYPES.ApplicationDataController).to(ApplicationDataController);
container.bind<IAuthenticationController>(TYPES.AuthenticationController).to(AuthenticationController);
container.bind<IAwardsController>(TYPES.AwardsController).to(AwardsController);
container.bind<IEducationController>(TYPES.EducationController).to(EducationController);
container.bind<IExperienceController>(TYPES.ExperienceController).to(ExperienceController);
container.bind<IMessagesController>(TYPES.MessagesController).to(MessagesController);
container.bind<IProjectsController>(TYPES.ProjectsController).to(ProjectsController);
container.bind<IUsersController>(TYPES.UsersController).to(UsersController);
container.bind<IUserVideosController>(TYPES.UserVideosController).to(UserVideosController);
container.bind<IWishesController>(TYPES.WishesController).to(WishesController);

container.bind<IAdministrationRoutesValidators>(TYPES.AdministrationRoutesValidators).to(AdministrationRoutesValidators);
container.bind<IAuthenticationRoutesValidators>(TYPES.AuthenticationRoutesValidators).to(AuthenticationRoutesValidators);
container.bind<IEntitiesValidators>(TYPES.EntitiesValidators).to(EntitiesValidators);
container.bind<IProjectRoutesValidators>(TYPES.ProjectRoutesValidators).to(ProjectRoutesValidators);
container.bind<IUserRoutesValidators>(TYPES.UserRoutesValidators).to(UserRoutesValidators);

container.bind<IAdministrationService>(TYPES.AdministrationService).to(AdministrationService);
container.bind<IApplicationDataService>(TYPES.ApplicationDataService).to(ApplicationDataService);
container.bind<IAuthenticationService>(TYPES.AuthenticationService).to(AuthenticationService);
container.bind<IAwardService>(TYPES.AwardService).to(AwardService);
container.bind<IEducationService>(TYPES.EducationService).to(EducationService);
container.bind<IExperienceService>(TYPES.ExperienceService).to(ExperienceService);
container.bind<IMessageService>(TYPES.MessageService).to(MessageService);
container.bind<IProjectService>(TYPES.ProjectService).to(ProjectService);
container.bind<ISkillService>(TYPES.SkillService).to(SkillService);
container.bind<IUserService>(TYPES.UserService).to(UserService);
container.bind<IUserVideoService>(TYPES.UserVideoService).to(UserVideoService);
container.bind<IWishService>(TYPES.WishService).to(WishService);
container.bind<IEmailService>(TYPES.EmailService).to(EmailService);

container.bind<IAwardRepository>(TYPES.AwardRepository).to(AwardRepository);
container.bind<IEducationRepository>(TYPES.EducationRepository).to(EducationRepository);
container.bind<IEntityCategoryRepository>(TYPES.EntityCategoryRepository).to(EntityCategoryRepository);
container.bind<IExperienceRepository>(TYPES.ExperienceRepository).to(ExperienceRepository);
container.bind<IMessageRepository>(TYPES.MessageRepository).to(MessageRepository);
container.bind<IProfessionalRepository>(TYPES.ProfessionalRepository).to(ProfessionalRepository);
container.bind<IProfessionalSkillRepository>(TYPES.ProfessionalSkillRepository).to(ProfessionalSkillRepository);
container.bind<IProjectRepository>(TYPES.ProjectRepository).to(ProjectRepository);
container.bind<IUserImageRepository>(TYPES.UserImageRepository).to(UserImageRepository);
container.bind<IUserSocialMediaRepository>(TYPES.UserSocialMediaRepository).to(UserSocialMediaRepository);
container.bind<ISkillRepository>(TYPES.SkillRepository).to(SkillRepository);
container.bind<IUserAccountSettingsRepository>(TYPES.UserAccountSettingsRepository).to(UserAccountSettingsRepository);
container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);
container.bind<IWishRepository>(TYPES.WishRepository).to(WishRepository);
container.bind<IUserVideoRepository>(TYPES.UserVideoRepository).to(UserVideoRepository);

export {container};
