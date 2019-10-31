import { User, UserImage }                     from "../../models";
import { UserAccountStatusType, UserRoleType } from "../../enums";

export class MeDTO {

    public constructor(user: User) {

        this.FirstName      = user.Professional.FirstName;
        this.LastName       = user.Professional.LastName;
        this.Email          = user.Email;
        this.Username       = user.Username;

        this.ProfileImage  = user.ProfileImage || user.PhotoGallery.find(p => p.IsProfileImage);

        this.Role           = user.AccountSettings.Role;
        this.AccountStatus  = user.AccountSettings.AccountStatus;
    }

    public FirstName: string;

    public LastName: string;

    public Email: string;

    public Username: string;

    public ProfileImage?: UserImage;

    public Role: UserRoleType;

    public AccountStatus: UserAccountStatusType;
}
