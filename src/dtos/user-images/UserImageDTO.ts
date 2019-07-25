import { UserImage } from "../../models";

export class UserImageDTO {

    public constructor(userImage: UserImage) {

        this.ID                 = userImage.ID;
        this.Key                = userImage.Key;
        this.Size               = userImage.Size;
        this.Location           = userImage.Location;
        this.IsProfileImage     = userImage.IsProfileImage;
    }

    public ID?: string;

    public Key: string;

    public Size: number;

    public Location: string;

    public ThumbnailLocation: string;

    public IsProfileImage?: boolean;

}
