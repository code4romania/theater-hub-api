import { Container }                                                                      from "inversify";
import { TYPES }                                                                          from "../types/custom-types";
import { IApplicationDataController, IAuthenticationController, IMessagesController,
    IProjectsController, IUsersController, IWishesController, ApplicationDataController,
    AuthenticationController, MessagesController,
    ProjectsController, UsersController, WishesController }                               from "../controllers";
import { IAuthenticationRoutesValidators, AuthenticationRoutesValidators,
         IProjectRoutesValidators, ProjectRoutesValidators,
         IUserRoutesValidators, UserRoutesValidators }                                    from "../validators";
import { IApplicationDataService, IMessageService, IProjectService, ISkillService,
    IUserService, IWishService, IEmailService, ApplicationDataService, MessageService,
    ProjectService, SkillService, UserService,
    WishService, EmailService, IAuthenticationService, AuthenticationService }            from "../services";
import { IAwardRepository, IEducationRepository, IEntityCategoryRepository,
    IExperienceRepository, IMessageRepository, IProfessionalSkillRepository,
    IProjectRepository, ISkillRepository, IUserAccountSettingsRepository,
    IUserImageRepository, IUserSocialMediaRepository,
    IUserRepository, IUserVideoRepository, IWishRepository, AwardRepository,
    EducationRepository, EntityCategoryRepository, ExperienceRepository, MessageRepository,
    ProfessionalSkillRepository, ProjectRepository,
    SkillRepository, UserAccountSettingsRepository, UserImageRepository,
    UserSocialMediaRepository, UserRepository, UserVideoRepository, WishRepository}       from "../repositories";

const container = new Container();

container.bind<IApplicationDataController>(TYPES.ApplicationDataController).to(ApplicationDataController);
container.bind<IAuthenticationController>(TYPES.AuthenticationController).to(AuthenticationController);
container.bind<IMessagesController>(TYPES.MessagesController).to(MessagesController);
container.bind<IProjectsController>(TYPES.ProjectsController).to(ProjectsController);
container.bind<IUsersController>(TYPES.UsersController).to(UsersController);
container.bind<IWishesController>(TYPES.WishesController).to(WishesController);

container.bind<IAuthenticationRoutesValidators>(TYPES.AuthenticationRoutesValidators).to(AuthenticationRoutesValidators);
container.bind<IProjectRoutesValidators>(TYPES.ProjectRoutesValidators).to(ProjectRoutesValidators);
container.bind<IUserRoutesValidators>(TYPES.UserRoutesValidators).to(UserRoutesValidators);

container.bind<IApplicationDataService>(TYPES.ApplicationDataService).to(ApplicationDataService);
container.bind<IAuthenticationService>(TYPES.AuthenticationService).to(AuthenticationService);
container.bind<IMessageService>(TYPES.MessageService).to(MessageService);
container.bind<IProjectService>(TYPES.ProjectService).to(ProjectService);
container.bind<ISkillService>(TYPES.SkillService).to(SkillService);
container.bind<IUserService>(TYPES.UserService).to(UserService);
container.bind<IWishService>(TYPES.WishService).to(WishService);
container.bind<IEmailService>(TYPES.EmailService).to(EmailService);

container.bind<IAwardRepository>(TYPES.AwardRepository).to(AwardRepository);
container.bind<IEducationRepository>(TYPES.EducationRepository).to(EducationRepository);
container.bind<IEntityCategoryRepository>(TYPES.EntityCategoryRepository).to(EntityCategoryRepository);
container.bind<IExperienceRepository>(TYPES.ExperienceRepository).to(ExperienceRepository);
container.bind<IMessageRepository>(TYPES.MessageRepository).to(MessageRepository);
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
