import { inject, injectable }               from "inversify";
const bcrypt                                = require("bcrypt");
const uuidv4                                = require("uuid/v4");
import { TYPES }                            from "../types";
import { IAdministrationService,
    IEmailService,
    ILocalizationService, IUserService }    from ".";
import { IUserAccountSettingsRepository,
    IUserRepository }                       from "../repositories";
import { Professional, User,
    UserAccountSettings }                   from "../models";
import { AdminInviteManagedUserEmailDTO,
        AdminUpdateUserEmailDTO,
        GetUsersRequestDTO,
        GetUsersResponseDTO,
        ManagedUserDTO,
        UpdateUserAccountStatusDTO }        from "../dtos";
import { EntityCategoryType,
    LocaleType,
    SortOrientationType,
    UserAccountProviderType,
    UserAccountStatusType,
    UserRoleType, UserSortCriterion,
    VisibilityType }                        from "../enums";

@injectable()
export class AdministrationService implements IAdministrationService {

    private readonly _userService: IUserService;
    private readonly _emailService: IEmailService;
    private readonly _userAccountSettingsRepository: IUserAccountSettingsRepository;
    private readonly _userRepository: IUserRepository;
    private readonly _localizationService: ILocalizationService;

    constructor(@inject(TYPES.UserService) userService: IUserService,
        @inject(TYPES.EmailService) emailService: IEmailService,
        @inject(TYPES.LocalizationService) localizationService: ILocalizationService,
        @inject(TYPES.UserAccountSettingsRepository) userAccountSettingsRepository: IUserAccountSettingsRepository,
        @inject(TYPES.UserRepository) userRepository: IUserRepository) {

        this._userService                   = userService;
        this._emailService                  = emailService;
        this._localizationService           = localizationService;
        this._userAccountSettingsRepository = userAccountSettingsRepository;
        this._userRepository                = userRepository;
    }

    public async getUsers(request: GetUsersRequestDTO): Promise<GetUsersResponseDTO> {

        const adminUser: User = await this._userService.getByEmail(request.MyEmail);

        this.checkIsAdminUser(adminUser);

        const searchTerm: string        = `%${request.SearchTerm.toLowerCase()}%`;
        const sortOrientation: string   = request.SortOrientation === SortOrientationType.ASC ? "ASC" : "DESC";

        let selectedUsers: User[] = await this._userRepository
            .runCreateQueryBuilder()
            .select("user")
            .from(User, "user")
            .leftJoinAndSelect("user.ProfileImage", "profileImage")
            .innerJoinAndSelect("user.Professional", "professional")
            .innerJoinAndSelect("user.AccountSettings", "accountSettings")
            .where("LOWER(user.Name) like :searchTerm OR LOWER(user.Email) like :searchTerm", { searchTerm: searchTerm })
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

        return new GetUsersResponseDTO(selectedUsers, total, request.Page);

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
            PasswordHash:       ""
        } as User;

        user.AccountSettings = {
            RegistrationIDHash:     registrationIDHash,
            EntityCategory:         EntityCategoryType.Professional,
            AccountProvider:        UserAccountProviderType.Local,
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

    public async enableUser(adminEmail: string, userID: string, updateUserAccountStatusDTO: UpdateUserAccountStatusDTO): Promise<void> {
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

        const adminUpdateUserEmailDTO: AdminUpdateUserEmailDTO = {
            SenderEmailAddress:     adminUser.Email,
            SenderFullName:         adminUser.Name,
            ReceiverEmailAddress:   dbUser.Email,
            ReceiverFullName:       dbUser.Name,
            Message:                updateUserAccountStatusDTO.Message || ""
        };

        this._emailService.setLocale(dbUser.AccountSettings.Locale);

        await this._emailService.sendAdminEnableUserEmail(adminUpdateUserEmailDTO);
    }

    public async disableUser(adminEmail: string, userID: string, updateUserAccountStatusDTO: UpdateUserAccountStatusDTO): Promise<void> {
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

        const adminUpdateUserEmailDTO: AdminUpdateUserEmailDTO = {
            SenderEmailAddress:     adminUser.Email,
            SenderFullName:         adminUser.Name,
            ReceiverEmailAddress:   dbUser.Email,
            ReceiverFullName:       dbUser.Name,
            Message:                updateUserAccountStatusDTO.Message || ""
        };

        this._emailService.setLocale(dbUser.AccountSettings.Locale);

        await this._emailService.sendAdminDisableUserEmail(adminUpdateUserEmailDTO);
    }

    public async deleteUser(adminEmail: string, userID: string, updateUserAccountStatusDTO: UpdateUserAccountStatusDTO): Promise<User> {
        const adminUser: User   = await this._userService.getByEmail(adminEmail);
        const dbUser: User      = await this._userService.getByID(userID);

        this.checkIsAdminUser(adminUser);

        if (adminUser.AccountSettings.Role <= dbUser.AccountSettings.Role) {
            throw new Error(this._localizationService.getText("validation.permissions.insufficient-permissions"));
        }

        await this._userService.deleteByID(userID);

        const adminUpdateUserEmailDTO: AdminUpdateUserEmailDTO = {
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

    public checkIsAdminUser(user: User) {

        if (!user || user.AccountSettings.Role === UserRoleType.User) {
            throw new Error(this._localizationService.getText("validation.permissions.not-admin"));
        }
    }

    public setLocale(locale: LocaleType): void {
        this._localizationService.setLocale(locale);
    }

}
