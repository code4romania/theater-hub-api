import { CommunityMemberDTO } from "./CommunityMemberDTO";

export class CommunitySkillLayer {

    public constructor (
        skillID: number,
        members: CommunityMemberDTO[],
        hasMore: boolean
    ) {
        this.SkillID = skillID;
        this.Members = members;
        this.HasMore = hasMore;
    }

    public SkillID: number;

    public Members: CommunityMemberDTO[];

    public HasMore: boolean;

}
