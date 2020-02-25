import { inject, injectable }               from "inversify";
const bcrypt                                = require("bcryptjs");
const uuidv4                                = require("uuid/v4");
import { TYPES }                            from "../types";
import { IAdministrationService,
    IEmailService,
    ILocalizationService, IUserService,
    IUserAccountSettingsRepository,
    IUserRepository, IProjectRepository,
    IProjectService}                       from "../contracts";
import { Professional, User, Project,
    UserAccountSettings }                  from "../models";
import { AdminInviteManagedUserEmailDTO,
        AdminUpdateEntityEmailDTO,
        AdminUpdateProjectEmailDTO,
        DashboardUser,
        DashboardProject,
        GetEntitiesRequestDTO,
        GetEntitiesResponseDTO,
        ManagedUserDTO,
        UpdateEntityStatusDTO }             from "../dtos";
import { EntityCategoryType,
    LocaleType,
    SortOrientationType,
    UserAccountProviderType,
    UserAccountStatusType,
    UserRoleType, UserSortCriterion,
    ProjectSortCriterion,
    ProjectStatusType,
    VisibilityType }                        from "../enums";

@injectable()
export class AdministrationService implements IAdministrationService {

    private readonly _userService: IUserService;
    private readonly _projectService: IProjectService;
    private readonly _emailService: IEmailService;
    private readonly _userAccountSettingsRepository: IUserAccountSettingsRepository;
    private readonly _userRepository: IUserRepository;
    private readonly _projectRepository: IProjectRepository;
    private readonly _localizationService: ILocalizationService;

    constructor(@inject(TYPES.UserService) userService: IUserService,
        @inject(TYPES.ProjectService) projectService: IProjectService,
        @inject(TYPES.EmailService) emailService: IEmailService,
        @inject(TYPES.LocalizationService) localizationService: ILocalizationService,
        @inject(TYPES.UserAccountSettingsRepository) userAccountSettingsRepository: IUserAccountSettingsRepository,
        @inject(TYPES.UserRepository) userRepository: IUserRepository,
        @inject(TYPES.ProjectRepository) projectRepository: IProjectRepository) {

        this._userService                   = userService;
        this._projectService                = projectService;
        this._emailService                  = emailService;
        this._localizationService           = localizationService;
        this._userAccountSettingsRepository = userAccountSettingsRepository;
        this._userRepository                = userRepository;
        this._projectRepository             = projectRepository;
    }

    public async getUsers(request: GetEntitiesRequestDTO): Promise<GetEntitiesResponseDTO<DashboardUser>> {

        const adminUser: User = await this._userService.getByEmail(request.MyEmail);

        this.checkIsAdminUser(adminUser);

        const searchTerm: string            = request.SearchTerm.toLowerCase().replace(/\s\s+/g, " ").trim();
        const likeSearchTerm: string        = `%${searchTerm}%`;
        const normalizedSearchTerm: string  = searchTerm.replace(/\s/g, " & ");

        let selectedUsers: User[] = await this._userRepository
            .runCreateQueryBuilder()
            .select("user")
            .from(User, "user")
            .leftJoinAndSelect("user.ProfileImage", "profileImage")
            .innerJoinAndSelect("user.Professional", "professional")
            .innerJoinAndSelect("user.AccountSettings", "accountSettings")
            .where(
                `accountSettings.AccountStatus <> :disabledStatus AND
                (
                    (:searchTerm = '') IS NOT FALSE OR
                    LOWER(user.Name) like :likeSearchTerm OR
                    LOWER(user.Description) like :likeSearchTerm OR
                    (user.SearchTokens @@ to_tsquery(:normalizedSearchTerm))
                )`,
                {
                    disabledStatus: UserAccountStatusType.Disabled,
                    searchTerm,
                    likeSearchTerm,
                    normalizedSearchTerm
                })
            .getMany();

        if (adminUser.AccountSettings.Role === UserRoleType.Admin) {
            selectedUsers = selectedUsers.filter(u => u.AccountSettings.Role === UserRoleType.User);
        } else {
            selectedUsers = selectedUsers.filter(u => u.AccountSettings.Role !== UserRoleType.SuperAdmin);
        }

        const sortOrientationModifier: number = request.SortOrientation === SortOrientationType.ASC ? 1 : -1;

        if (request.SortCriterion === UserSortCriterion.Name) {
            selectedUsers = selectedUsers.sort((u1, u2) => {
                if (u1.Name > u2.Name) {
                    return sortOrientationModifier;
                } else if (u1.Name < u2.Name) {
                    return -sortOrientationModifier;
                }

                return 0;
            });
        } else if (request.SortCriterion === UserSortCriterion.Email) {
            selectedUsers = selectedUsers.sort((u1, u2) => {
                if (u1.Email > u2.Email) {
                    return sortOrientationModifier;
                } else if (u1.Email < u2.Email) {
                    return -sortOrientationModifier;
                }

                return 0;
            });
        } else if (request.SortCriterion === UserSortCriterion.Role) {
            selectedUsers = selectedUsers.sort((u1, u2) => {
                if (u1.AccountSettings.Role > u2.AccountSettings.Role) {
                    return sortOrientationModifier;
                } else if (u1.AccountSettings.Role < u2.AccountSettings.Role) {
                    return -sortOrientationModifier;
                }

                return 0;
            });
        } else if (request.SortCriterion === UserSortCriterion.AccountStatus) {
            selectedUsers = selectedUsers.sort((u1, u2) => {
                if (u1.AccountSettings.AccountStatus > u2.AccountSettings.AccountStatus) {
                    return sortOrientationModifier;
                } else if (u1.AccountSettings.AccountStatus < u2.AccountSettings.AccountStatus) {
                    return -sortOrientationModifier;
                }

                return 0;
            });
        } else if (request.SortCriterion === UserSortCriterion.ProfileVisibility) {
            selectedUsers = selectedUsers.sort((u1, u2) => {
                if (u1.AccountSettings.ProfileVisibility > u2.AccountSettings.ProfileVisibility) {
                    return sortOrientationModifier;
                } else if (u1.AccountSettings.ProfileVisibility < u2.AccountSettings.ProfileVisibility) {
                    return -sortOrientationModifier;
                }

                return 0;
            });
        }

        const total: number = selectedUsers.length;

        selectedUsers = selectedUsers.splice(request.Page * request.PageSize, request.PageSize);

        return new GetEntitiesResponseDTO<DashboardUser>(selectedUsers.map(u => new DashboardUser(u)), total, request.Page, request.PageSize);

    }

    public async inviteUser(email: string, managedUser: ManagedUserDTO): Promise<User> {
        const adminUser: User   = await this._userService.getByEmail(email);
        const dbUser: User      = await this._userService.getByEmail(managedUser.Email);

        this.checkIsAdminUser(adminUser);

        if (dbUser && dbUser.AccountSettings.AccountStatus === UserAccountStatusType.Managed) {
            // Delete previous unfinished registration attempt.
            this._userService.deleteByID(dbUser.ID);
        }

        const saltRounds: number     = 10;
        const registrationID: string = uuidv4();
        const registrationIDSalt     = bcrypt.genSaltSync(saltRounds);
        const registrationIDHash     = bcrypt.hashSync(registrationID, registrationIDSalt);

        const user: User = {
            Email:              managedUser.Email,
            Name:               "",
            PasswordHash:       "",
            Username:           uuidv4()
        } as User;

        user.AccountSettings = {
            RegistrationIDHash:     registrationIDHash,
            EntityCategory:         EntityCategoryType.Professional,
            AccountProvider:        UserAccountProviderType.Local,
            InviterEmail:           adminUser.Email,
            AccountStatus:          UserAccountStatusType.Managed,
            Role:                   managedUser.Role,
            ProfileVisibility:      VisibilityType.Private,
            EmailVisibility:        VisibilityType.Private,
            BirthDateVisibility:    VisibilityType.Private,
            PhoneNumberVisibility:  VisibilityType.Private,
            Locale:                 managedUser.Locale
        } as UserAccountSettings;

        user.Professional  = {
            FirstName: "",
            LastName:  ""
        } as Professional;

        await this._userService.create(user);

        const inviteManagedUserEmailDTO: AdminInviteManagedUserEmailDTO = {
            SenderEmailAddress:     adminUser.Email,
            SenderFullName:         adminUser.Name,
            ReceiverEmailAddress:   managedUser.Email,
            ReceiverRole:           user.AccountSettings.Role.toString(),
            RegistrationID:         registrationID
        };

        this._emailService.setLocale(managedUser.Locale || adminUser.AccountSettings.Locale);

        await this._emailService.sendAdminInviteManagedUserEmail(inviteManagedUserEmailDTO);

        return user;

    }

    public async enableUser(adminEmail: string, userID: string, updateUserAccountStatusDTO: UpdateEntityStatusDTO): Promise<void> {
        const adminUser: User   = await this._userService.getByEmail(adminEmail);
        const dbUser: User      = await this._userService.getByID(userID);

        this.checkIsAdminUser(adminUser);

        if (adminUser.AccountSettings.Role <= dbUser.AccountSettings.Role) {
            throw new Error(this._localizationService.getText("validation.permissions.insufficient-permissions"));
        }

        if (dbUser.AccountSettings.AccountStatus !== UserAccountStatusType.Disabled) {
            return;
        }

        const dbUserAccountSettings         = await this._userAccountSettingsRepository.getByID(dbUser.AccountSettings.ID);
        dbUserAccountSettings.AccountStatus = UserAccountStatusType.Enabled;

        await this._userAccountSettingsRepository.update(dbUserAccountSettings);

        const adminUpdateUserEmailDTO: AdminUpdateEntityEmailDTO = {
            SenderEmailAddress:     adminUser.Email,
            SenderFullName:         adminUser.Name,
            ReceiverEmailAddress:   dbUser.Email,
            ReceiverFullName:       dbUser.Name,
            Message:                updateUserAccountStatusDTO.Message || ""
        };

        this._emailService.setLocale(dbUser.AccountSettings.Locale);

        await this._emailService.sendAdminEnableUserEmail(adminUpdateUserEmailDTO);
    }

    public async disableUser(adminEmail: string, userID: string, updateUserAccountStatusDTO: UpdateEntityStatusDTO): Promise<void> {
        const adminUser: User   = await this._userService.getByEmail(adminEmail);
        const dbUser: User      = await this._userService.getByID(userID);

        this.checkIsAdminUser(adminUser);

        if (adminUser.AccountSettings.Role <= dbUser.AccountSettings.Role) {
            throw new Error(this._localizationService.getText("validation.permissions.insufficient-permissions"));
        }

        if (dbUser.AccountSettings.AccountStatus !== UserAccountStatusType.Enabled) {
            return;
        }

        const dbUserAccountSettings         = await this._userAccountSettingsRepository.getByID(dbUser.AccountSettings.ID);
        dbUserAccountSettings.AccountStatus = UserAccountStatusType.Disabled;

        await this._userAccountSettingsRepository.update(dbUserAccountSettings);

        const adminUpdateUserEmailDTO: AdminUpdateEntityEmailDTO = {
            SenderEmailAddress:     adminUser.Email,
            SenderFullName:         adminUser.Name,
            ReceiverEmailAddress:   dbUser.Email,
            ReceiverFullName:       dbUser.Name,
            Message:                updateUserAccountStatusDTO.Message || ""
        };

        this._emailService.setLocale(dbUser.AccountSettings.Locale);

        await this._emailService.sendAdminDisableUserEmail(adminUpdateUserEmailDTO);
    }

    public async deleteUser(adminEmail: string, userID: string, updateUserAccountStatusDTO: UpdateEntityStatusDTO): Promise<User> {
        const adminUser: User   = await this._userService.getByEmail(adminEmail);
        const dbUser: User      = await this._userService.getByID(userID);

        this.checkIsAdminUser(adminUser);

        if (adminUser.AccountSettings.Role <= dbUser.AccountSettings.Role) {
            throw new Error(this._localizationService.getText("validation.permissions.insufficient-permissions"));
        }

        await this._userService.deleteByID(userID);

        const adminUpdateUserEmailDTO: AdminUpdateEntityEmailDTO = {
            SenderEmailAddress:     adminUser.Email,
            SenderFullName:         adminUser.Name,
            ReceiverEmailAddress:   dbUser.Email,
            ReceiverFullName:       dbUser.Name,
            Message:                updateUserAccountStatusDTO.Message || ""
        };

        this._emailService.setLocale(dbUser.AccountSettings.Locale);

        await this._emailService.sendAdminDeleteUserEmail(adminUpdateUserEmailDTO);

        return dbUser;
    }

    public async getProjects(request: GetEntitiesRequestDTO): Promise<GetEntitiesResponseDTO<DashboardProject>> {
        const adminUser: User   = await this._userService.getByEmail(request.MyEmail);

        this.checkIsAdminUser(adminUser);

        const searchTerm: string            = request.SearchTerm.toLowerCase().replace(/\s\s+/g, " ").trim();
        const likeSearchTerm: string        = `%${searchTerm}%`;
        const normalizedSearchTerm: string  = searchTerm.replace(/\s/g, " & ");

        let projects: Project[];

        try {

            projects = await this._projectRepository
                .runCreateQueryBuilder()
                .select("project")
                .from(Project, "project")
                .leftJoinAndSelect("project.Initiator", "initiator")
                .where(
                    `
                        (:searchTerm = '') IS NOT FALSE OR
                        LOWER(project.Name) like :likeSearchTerm OR
                        LOWER(project.Description) like :likeSearchTerm OR
                        ((select COUNT(*) from public."ProjectNeed" pn where pn."ProjectID" = project.ID AND LOWER(pn."Description") like :likeSearchTerm) > 0) OR
                        (project.SearchTokens @@ to_tsquery(:normalizedSearchTerm))
                    `,
                    {
                        searchTerm,
                        likeSearchTerm,
                        normalizedSearchTerm
                    }
                )
                .getMany();

            } catch (error) {
                return new GetEntitiesResponseDTO([], 0, 0, request.PageSize);
        }

        const sortOrientationModifier: number = request.SortOrientation === SortOrientationType.ASC ? 1 : -1;

        if (request.SortCriterion === ProjectSortCriterion.Name) {
            projects = projects.sort((p1, p2) => {
                if (p1.Name > p2.Name) {
                    return sortOrientationModifier;
                } else if (p1.Name < p2.Name) {
                    return -sortOrientationModifier;
                }

                return 0;
            });
        } else if (request.SortCriterion === ProjectSortCriterion.City) {
            projects = projects.sort((p1, p2) => {
                if (p1.City > p2.City) {
                    return sortOrientationModifier;
                } else if (p1.City < p2.City) {
                    return -sortOrientationModifier;
                }

                return 0;
            });
        } else if (request.SortCriterion === ProjectSortCriterion.InitiatorName) {
            projects = projects.sort((p1, p2) => {
                if (p1.Initiator.Name > p2.Initiator.Name) {
                    return sortOrientationModifier;
                } else if (p1.Initiator.Name < p2.Initiator.Name) {
                    return -sortOrientationModifier;
                }

                return 0;
            });
        } else if (request.SortCriterion === ProjectSortCriterion.Status) {
            projects = projects.sort((p1, p2) => {
                if (p1.Status > p2.Status) {
                    return sortOrientationModifier;
                } else if (p1.Status < p2.Status) {
                    return -sortOrientationModifier;
                }

                return 0;
            });
        } else if (request.SortCriterion === ProjectSortCriterion.Visibility) {
            projects = projects.sort((p1, p2) => {
                if (p1.Visibility > p2.Visibility) {
                    return sortOrientationModifier;
                } else if (p1.Visibility < p2.Visibility) {
                    return -sortOrientationModifier;
                }

                return 0;
            });
        }

        const total: number = projects.length;

        projects = projects.splice(request.Page * request.PageSize, request.PageSize);

        return new GetEntitiesResponseDTO<DashboardProject>(projects.map(p => new DashboardProject(p)), total, request.Page, request.PageSize);

    }

    public async enableProject(adminEmail: string,
                                projectID: string,
                                updateProjectStatusDTO: UpdateEntityStatusDTO): Promise<void> {
        const adminUser: User   = await this._userService.getByEmail(adminEmail);

        this.checkIsAdminUser(adminUser);

        const project = await this._projectRepository
            .runCreateQueryBuilder()
            .select("project")
            .from(Project, "project")
            .innerJoinAndSelect("project.Initiator", "initiator")
            .innerJoinAndSelect("initiator.AccountSettings", "accountSettings")
            .where("project.ID = :id", { id: projectID })
            .getOne();

        const dbUser = project.Initiator;

        if (project.Status !== ProjectStatusType.Disabled) {
            return;
        }

        project.Status = ProjectStatusType.Enabled;
        await this._projectRepository.update(project);

        const adminUpdateUserEmailDTO: AdminUpdateProjectEmailDTO = {
            SenderEmailAddress:     adminUser.Email,
            SenderFullName:         adminUser.Name,
            ReceiverEmailAddress:   dbUser.Email,
            ReceiverFullName:       dbUser.Name,
            Message:                updateProjectStatusDTO.Message || "",
            ProjectName:            project.Name
        };

        this._emailService.setLocale(dbUser.AccountSettings.Locale);

        await this._emailService.sendAdminEnableProjectEmail(adminUpdateUserEmailDTO);
    }

    public async disableProject(adminEmail: string,
                                projectID: string,
                                updateProjectStatusDTO: UpdateEntityStatusDTO): Promise<void> {
        const adminUser: User   = await this._userService.getByEmail(adminEmail);

        this.checkIsAdminUser(adminUser);

        const project = await this._projectRepository
            .runCreateQueryBuilder()
            .select("project")
            .from(Project, "project")
            .innerJoinAndSelect("project.Initiator", "initiator")
            .innerJoinAndSelect("initiator.AccountSettings", "accountSettings")
            .where("project.ID = :id", { id: projectID })
            .getOne();

        const dbUser = project.Initiator;

        if (project.Status !== ProjectStatusType.Enabled) {
            return;
        }

        project.Status = ProjectStatusType.Disabled;
        await this._projectRepository.update(project);

        const adminUpdateUserEmailDTO: AdminUpdateProjectEmailDTO = {
            SenderEmailAddress:     adminUser.Email,
            SenderFullName:         adminUser.Name,
            ReceiverEmailAddress:   dbUser.Email,
            ReceiverFullName:       dbUser.Name,
            Message:                updateProjectStatusDTO.Message || "",
            ProjectName:            project.Name
        };

        this._emailService.setLocale(dbUser.AccountSettings.Locale);

        await this._emailService.sendAdminDisableProjectEmail(adminUpdateUserEmailDTO);

    }

    public async deleteProject(adminEmail: string, projectID: string, updateProjectStatusDTO: UpdateEntityStatusDTO): Promise<User> {
        const adminUser: User   = await this._userService.getByEmail(adminEmail);

        this.checkIsAdminUser(adminUser);

        const project = await this._projectRepository
            .runCreateQueryBuilder()
            .select("project")
            .from(Project, "project")
            .innerJoinAndSelect("project.Initiator", "initiator")
            .innerJoinAndSelect("initiator.AccountSettings", "accountSettings")
            .where("project.ID = :id", { id: projectID })
            .getOne();

        const dbUser = project.Initiator;

        await this._projectService.deleteByID(projectID);

        const adminUpdateUserEmailDTO: AdminUpdateProjectEmailDTO = {
            SenderEmailAddress:     adminUser.Email,
            SenderFullName:         adminUser.Name,
            ReceiverEmailAddress:   dbUser.Email,
            ReceiverFullName:       dbUser.Name,
            Message:                updateProjectStatusDTO.Message || "",
            ProjectName:            project.Name
        };

        this._emailService.setLocale(dbUser.AccountSettings.Locale);

        await this._emailService.sendAdminDeleteProjectEmail(adminUpdateUserEmailDTO);

        return dbUser;
    }

    public checkIsAdminUser(user: User) {

        if (!user || user.AccountSettings.Role === UserRoleType.User) {
            throw new Error(this._localizationService.getText("validation.permissions.not-admin"));
        }
    }

    public setLocale(locale: LocaleType): void {
        this._localizationService.setLocale(locale);
    }

}
