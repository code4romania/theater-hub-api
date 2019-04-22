import { CommunityMemberDTO } from "./CommunityMemberDTO";
import { User }               from "../../models";

export class CommunitySkillLayer {

    public constructor(skillID: number, users: User[], hasMore: boolean) {
        this.SkillID = skillID;
        this.Members = users.map(u => new CommunityMemberDTO(u));
        this.HasMore = hasMore;
    }

    public SkillID: number;

    public Members: CommunityMemberDTO[];

    public HasMore: boolean;

}
