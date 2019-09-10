import { CommunityMemberDTO } from "./index";
import { User } from "../../models";

export class GetCommunityMembersResponse {

    public constructor(users: User[], communitySize: number) {
        this.Members        = users.map(u => new CommunityMemberDTO(u, true));
        this.CommunitySize  = communitySize;
    }

    public Members: CommunityMemberDTO[];

    public CommunitySize: number;

}
