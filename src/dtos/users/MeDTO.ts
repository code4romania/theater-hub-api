import { User }                                from "../../models";
import { UserAccountStatusType, UserRoleType } from "../../enums";

export class MeDTO {

    public constructor(user: User) {

        this.FirstName      = user.Professional.FirstName;
        this.LastName       = user.Professional.LastName;
        this.Email          = user.Email;
        this.ProfileImage   = user.ProfileImage ? user.ProfileImage.Image.toString() : "";
        this.Role           = user.AccountSettings.Role;
        this.AccountStatus  = user.AccountSettings.AccountStatus;
    }

    public FirstName: string;

    public LastName: string;

    public Email: string;

    public ProfileImage: string;

    public Role: UserRoleType;

    public AccountStatus: UserAccountStatusType;
}
