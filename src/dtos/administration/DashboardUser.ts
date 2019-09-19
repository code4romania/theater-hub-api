import { User }                                                from "../../models";
import { UserAccountProviderType, UserAccountStatusType,
                                UserRoleType, VisibilityType } from "../../enums";

export class DashboardUser {

    public constructor(user: User) {
        this.ID                 = user.ID;
        this.ProfileImage       = user.ProfileImage ? user.ProfileImage.ThumbnailLocation : "";
        this.Username           = user.Username;
        this.FirstName          = user.Professional.FirstName;
        this.LastName           = user.Professional.LastName;
        this.Email              = user.Email;
        this.AccountProvider    = user.AccountSettings.AccountProvider;
        this.InviterEmail       = user.AccountSettings.InviterEmail;
        this.AccountStatus      = user.AccountSettings.AccountStatus;
        this.Role               = user.AccountSettings.Role;
        this.ProfileVisibility  = user.AccountSettings.ProfileVisibility;
    }

    public ID: string;

    public Username: string;

    public ProfileImage: string;

    public FirstName: string;

    public LastName: string;

    public Email: string;

    public AccountProvider: UserAccountProviderType;

    public InviterEmail?: string;

    public AccountStatus: UserAccountStatusType;

    public Role: UserRoleType;

    public ProfileVisibility: VisibilityType;

}
