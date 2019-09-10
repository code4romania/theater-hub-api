import { User } from "../../models";

export class CommunityMemberDTO {

    public constructor(user: User, includeID: boolean = false) {
        if (includeID) {
            this.ID = user.ID;
        }

        this.ProfileImage   = user.ProfileImage ? user.ProfileImage.ThumbnailLocation : "";
        this.FirstName      = user.Professional.FirstName;
        this.LastName       = user.Professional.LastName;
        this.Username       = user.Username;
        this.SkillIDs       = user.Professional.Skills ? user.Professional.Skills.map(s => s.SkillID) : [];
    }

    public ID: string;

    public ProfileImage: string;

    public FirstName: string;

    public LastName: string;

    public Username: string;

    public SkillIDs: number[];

}
