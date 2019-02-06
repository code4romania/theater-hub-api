import { inject, injectable }               from "inversify";
const bcrypt                                = require("bcrypt");
const uuidv4                                = require("uuid/v4");
import { TYPES }                            from "../types";
import { IAdministrationService,
    IEmailService, IUserService }           from ".";
import { IUserAccountSettingsRepository,
    IUserRepository }                       from "../repositories";
import { Professional, User,
    UserAccountSettings }                   from "../models";
import { AdminAddManagedUserEmailDTO,
        AdminUpdateUserEmailDTO,
        GetUsersRequestDTO,
        GetUsersResponseDTO,
        ManagedUserDTO,
        UpdateUserAccountStatusDTO }        from "../dtos";
import { EntityCategoryType,
    SortOrientationType,
    UserAccountStatusType,
    UserRoleType, UserSortCriterion,
    VisibilityType }                        from "../enums";

@injectable()
export class AdministrationService implements IAdministrationService {

    private readonly _userSevice: IUserService;
    private readonly _emailService: IEmailService;
    private readonly _userAccountSettingsRepository: IUserAccountSettingsRepository;
    private readonly _userRepository: IUserRepository;

    constructor(@inject(TYPES.UserService) userService: IUserService,
        @inject(TYPES.EmailService) emailService: IEmailService,
        @inject(TYPES.UserAccountSettingsRepository) userAccountSettingsRepository: IUserAccountSettingsRepository,
        @inject(TYPES.UserRepository) userRepository: IUserRepository) {

        this._userSevice                    = userService;
        this._emailService                  = emailService;
        this._userAccountSettingsRepository = userAccountSettingsRepository;
        this._userRepository                = userRepository;
    }

    public async getUsers(request: GetUsersRequestDTO): Promise<GetUsersResponseDTO> {

        const adminUser: User = await this._userSevice.getByEmail(request.MyEmail);

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

    public async addUser(email: string, managedUser: ManagedUserDTO): Promise<User> {
        const adminUser: User   = await this._userSevice.getByEmail(email);
        const dbUser: User      = await this._userSevice.getByEmail(managedUser.Email);

        this.checkIsAdminUser(adminUser);

        if (adminUser.AccountSettings.Role === UserRoleType.Admin && managedUser.Role !== UserRoleType.User) {
            throw new Error("Insufficient permissions.");
        }

        if (dbUser && dbUser.AccountSettings.AccountStatus !== UserAccountStatusType.Managed) {
            throw new Error("E-mail already in use");
        } else if (!!dbUser) {
            // Delete previous unfinished registration attempt.
            this._userSevice.deleteByID(dbUser.ID);
        }

        const saltRounds: number     = 10;
        const registrationID: string = uuidv4();
        const registrationIDSalt     = bcrypt.genSaltSync(saltRounds);
        const registrationIDHash     = bcrypt.hashSync(registrationID, registrationIDSalt);

        const user: User = {
            Email:              managedUser.Email,
            Name:               `${managedUser.FirstName} ${managedUser.LastName}`,
            PasswordHash:       ""
        } as User;

        user.AccountSettings = {
            RegistrationIDHash:     registrationIDHash,
            EntityCategory:         EntityCategoryType.Professional,
            AccountStatus:          UserAccountStatusType.Managed,
            Role:                   managedUser.Role,
            ProfileVisibility:      VisibilityType.Private,
            EmailVisibility:        VisibilityType.Private,
            BirthDateVisibility:    VisibilityType.Private,
            PhoneNumberVisibility:  VisibilityType.Private
        } as UserAccountSettings;

        if (managedUser.Role === UserRoleType.User) {
            user.Professional  = {
                FirstName: managedUser.FirstName,
                LastName:  managedUser.LastName
            } as Professional;
        }

        await this._userSevice.create(user);

        const addManagedUserEmailDTO: AdminAddManagedUserEmailDTO = {
            SenderEmailAddres:      adminUser.Email,
            SenderFullName:         adminUser.Name,
            ReceiverEmailAddress:   managedUser.Email,
            ReceiverFullName:       `${managedUser.FirstName} ${managedUser.LastName}`,
            ReceiverRole:           user.AccountSettings.Role.toString(),
            RegistrationID:         registrationID
        };

        await this._emailService.sendAdminAddManagedUserEmail(addManagedUserEmailDTO);

        return user;

    }

    public async enableUser(adminEmail: string, userID: string, updateUserAccountStatusDTO: UpdateUserAccountStatusDTO): Promise<void> {
        const adminUser: User   = await this._userSevice.getByEmail(adminEmail);
        const dbUser: User      = await this._userSevice.getByID(userID);

        this.checkIsAdminUser(adminUser);

        if (adminUser.AccountSettings.Role <= dbUser.AccountSettings.Role) {
            throw new Error("Insufficient permissions.");
        }

        if (dbUser.AccountSettings.AccountStatus !== UserAccountStatusType.Disabled) {
            return;
        }

        const dbUserAccountSettings         = await this._userAccountSettingsRepository.getByID(dbUser.AccountSettings.ID);
        dbUserAccountSettings.AccountStatus = UserAccountStatusType.Enabled;

        await this._userAccountSettingsRepository.update(dbUserAccountSettings);

        const adminUpdateUserEmailDTO: AdminUpdateUserEmailDTO = {
            SenderEmailAddres:      adminUser.Email,
            SenderFullName:         adminUser.Name,
            ReceiverEmailAddress:   dbUser.Email,
            ReceiverFullName:       dbUser.Name,
            Message:                updateUserAccountStatusDTO.Message
        };

        await this._emailService.sendAdminEnableUserEmail(adminUpdateUserEmailDTO);
    }

    public async disableUser(adminEmail: string, userID: string, updateUserAccountStatusDTO: UpdateUserAccountStatusDTO): Promise<void> {
        const adminUser: User   = await this._userSevice.getByEmail(adminEmail);
        const dbUser: User      = await this._userSevice.getByID(userID);

        this.checkIsAdminUser(adminUser);

        if (adminUser.AccountSettings.Role <= dbUser.AccountSettings.Role) {
            throw new Error("Insufficient permissions.");
        }

        if (dbUser.AccountSettings.AccountStatus !== UserAccountStatusType.Enabled) {
            return;
        }

        const dbUserAccountSettings         = await this._userAccountSettingsRepository.getByID(dbUser.AccountSettings.ID);
        dbUserAccountSettings.AccountStatus = UserAccountStatusType.Disabled;

        await this._userAccountSettingsRepository.update(dbUserAccountSettings);

        const adminUpdateUserEmailDTO: AdminUpdateUserEmailDTO = {
            SenderEmailAddres:      adminUser.Email,
            SenderFullName:         adminUser.Name,
            ReceiverEmailAddress:   dbUser.Email,
            ReceiverFullName:       dbUser.Name,
            Message:                updateUserAccountStatusDTO.Message
        };

        await this._emailService.sendAdminDisableUserEmail(adminUpdateUserEmailDTO);
    }

    public async deleteUser(adminEmail: string, userID: string, updateUserAccountStatusDTO: UpdateUserAccountStatusDTO): Promise<User> {
        const adminUser: User   = await this._userSevice.getByEmail(adminEmail);
        const dbUser: User      = await this._userSevice.getByID(userID);

        this.checkIsAdminUser(adminUser);

        if (adminUser.AccountSettings.Role <= dbUser.AccountSettings.Role) {
            throw new Error("Insufficient permissions.");
        }

        await this._userSevice.deleteByID(userID);

        const adminUpdateUserEmailDTO: AdminUpdateUserEmailDTO = {
            SenderEmailAddres:      adminUser.Email,
            SenderFullName:         adminUser.Name,
            ReceiverEmailAddress:   dbUser.Email,
            ReceiverFullName:       dbUser.Name,
            Message:                updateUserAccountStatusDTO.Message
        };

        await this._emailService.sendAdminDeleteUserEmail(adminUpdateUserEmailDTO);

        return dbUser;
    }

    public checkIsAdminUser(user: User) {

        if (!user || user.AccountSettings.Role === UserRoleType.User) {
            throw new Error("Invalid admin account");
        }
    }

}
