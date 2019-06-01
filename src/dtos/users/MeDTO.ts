import { User, UserImage }                     from "../../models";
import { UserAccountStatusType, UserRoleType } from "../../enums";

export class MeDTO {

    public constructor(user: User) {

        this.FirstName      = user.Professional.FirstName;
        this.LastName       = user.Professional.LastName;
        this.Email          = user.Email;
        this.Username       = user.Username;

        if (user.ProfileImage) {
            this.ProfileImage       = {
                ...user.ProfileImage,
                // Image: user.ProfileImage.Image.toString()
            };
        }

        this.Role           = user.AccountSettings.Role;
        this.AccountStatus  = user.AccountSettings.AccountStatus;
    }

    public FirstName: string;

    public LastName: string;

    public Email: string;

    public Username: string;

    public ProfileImage: UserImage;

    public Role: UserRoleType;

    public AccountStatus: UserAccountStatusType;
}
