import { Container }                                                                      from "inversify";
import { TYPES }                                                                          from "../types/custom-types";
import { IAdministrationController,
    IApplicationDataController, IAuthenticationController,
    IAwardsController, IEducationController, IExperienceController,
    IProjectsController, IUsersController, IUserVideosController,
    IAuthenticationService, IAdministrationService, IApplicationDataService, IAwardService,
    IEducationService, IExperienceService, IFileService, ILocalizationService,
    IProjectService, ISkillService,
    IUserService, IUserVideoService, IEmailService,
    IAwardRepository, IEducationRepository, IEntityCategoryRepository,
    IExperienceRepository, ILocaleRepository, ICurrencyRepository,
    IProfessionalRepository, IProfessionalSkillRepository, IProjectRepository,
    ISkillRepository, IUserAccountSettingsRepository,
    IUserFileRepository, IUserImageRepository, IUserSocialMediaRepository,
    IUserRepository, IUserVideoRepository,
    IAdministrationRoutesValidators, IAuthenticationRoutesValidators,
    IEntitiesValidators, IProjectRoutesValidators, IUserRoutesValidators }          from "../contracts";
import { AdministrationController,
        ApplicationDataController, AuthenticationController,
        AwardsController, EducationController, ExperienceController,
        ProjectsController, UsersController,
        UserVideosController }                                                      from "../controllers";
import { AdministrationRoutesValidators, AuthenticationRoutesValidators,
         EntitiesValidators, ProjectRoutesValidators,
         UserRoutesValidators }                                                     from "../validators";
import {
    AdministrationService, ApplicationDataService, AwardService,
    EducationService, ExperienceService, FileService, LocalizationService,
    ProjectService, SkillService, UserService, UserVideoService,
    EmailService, AuthenticationService }                                           from "../services";
import { AwardRepository,
    EducationRepository, EntityCategoryRepository, ExperienceRepository,
    LocaleRepository, CurrencyRepository,
    ProfessionalRepository, ProfessionalSkillRepository, ProjectRepository,
    SkillRepository, UserAccountSettingsRepository,
    UserFileRepository, UserImageRepository,
    UserSocialMediaRepository, UserRepository, UserVideoRepository }                from "../repositories";

const container = new Container();

container.bind<IAdministrationController>(TYPES.AdministrationController).to(AdministrationController);
container.bind<IApplicationDataController>(TYPES.ApplicationDataController).to(ApplicationDataController);
container.bind<IAuthenticationController>(TYPES.AuthenticationController).to(AuthenticationController);
container.bind<IAwardsController>(TYPES.AwardsController).to(AwardsController);
container.bind<IEducationController>(TYPES.EducationController).to(EducationController);
container.bind<IExperienceController>(TYPES.ExperienceController).to(ExperienceController);
container.bind<IProjectsController>(TYPES.ProjectsController).to(ProjectsController);
container.bind<IUsersController>(TYPES.UsersController).to(UsersController);
container.bind<IUserVideosController>(TYPES.UserVideosController).to(UserVideosController);

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
container.bind<IFileService>(TYPES.FileService).to(FileService);
container.bind<ILocalizationService>(TYPES.LocalizationService).to(LocalizationService);
container.bind<IProjectService>(TYPES.ProjectService).to(ProjectService);
container.bind<ISkillService>(TYPES.SkillService).to(SkillService);
container.bind<IUserService>(TYPES.UserService).to(UserService);
container.bind<IUserVideoService>(TYPES.UserVideoService).to(UserVideoService);
container.bind<IEmailService>(TYPES.EmailService).to(EmailService);

container.bind<IAwardRepository>(TYPES.AwardRepository).to(AwardRepository);
container.bind<IEducationRepository>(TYPES.EducationRepository).to(EducationRepository);
container.bind<IEntityCategoryRepository>(TYPES.EntityCategoryRepository).to(EntityCategoryRepository);
container.bind<IExperienceRepository>(TYPES.ExperienceRepository).to(ExperienceRepository);
container.bind<ILocaleRepository>(TYPES.LocaleRepository).to(LocaleRepository);
container.bind<ICurrencyRepository>(TYPES.CurrencyRepository).to(CurrencyRepository);
container.bind<IProfessionalRepository>(TYPES.ProfessionalRepository).to(ProfessionalRepository);
container.bind<IProfessionalSkillRepository>(TYPES.ProfessionalSkillRepository).to(ProfessionalSkillRepository);
container.bind<IProjectRepository>(TYPES.ProjectRepository).to(ProjectRepository);
container.bind<IUserFileRepository>(TYPES.UserFileRepository).to(UserFileRepository);
container.bind<IUserImageRepository>(TYPES.UserImageRepository).to(UserImageRepository);
container.bind<IUserSocialMediaRepository>(TYPES.UserSocialMediaRepository).to(UserSocialMediaRepository);
container.bind<ISkillRepository>(TYPES.SkillRepository).to(SkillRepository);
container.bind<IUserAccountSettingsRepository>(TYPES.UserAccountSettingsRepository).to(UserAccountSettingsRepository);
container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);
container.bind<IUserVideoRepository>(TYPES.UserVideoRepository).to(UserVideoRepository);

export {container};
