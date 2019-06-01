import { User }                                                from "../../models";
import { UserAccountStatusType, UserRoleType, VisibilityType } from "../../enums";

export class DashboardUser {

    public constructor(user: User) {
        this.ID                 = user.ID;
        // this.ProfileImage       = user.ProfileImage ? user.ProfileImage.Image.toString() : "";
        this.FirstName          = user.Professional.FirstName;
        this.LastName           = user.Professional.LastName;
        this.Email              = user.Email;
        this.AccountStatus      = user.AccountSettings.AccountStatus;
        this.Role               = user.AccountSettings.Role;
        this.ProfileVisibility  = user.AccountSettings.ProfileVisibility;
    }

    public ID: string;

    public ProfileImage: string;

    public FirstName: string;

    public LastName: string;

    public Email: string;

    public AccountStatus: UserAccountStatusType;

    public Role: UserRoleType;

    public ProfileVisibility: VisibilityType;

}
