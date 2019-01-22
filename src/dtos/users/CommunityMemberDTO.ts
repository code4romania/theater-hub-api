import { User } from "../../models";

export class CommunityMemberDTO {

    public constructor(user: User) {
        this.ID             = user.ID;
        this.ProfileImage   = user.ProfileImage ? user.ProfileImage.Image.toString() : "";
        this.FirstName      = user.Professional.FirstName;
        this.LastName       = user.Professional.LastName;
        this.SkillIDs       = user.Professional.Skills.map(s => s.SkillID);
    }

    public ID: string;

    public ProfileImage: string;

    public FirstName: string;

    public LastName: string;

    public SkillIDs: number[];

}
