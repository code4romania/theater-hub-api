import { CommunityMemberDTO } from "./index";

export class GetCommunityMembersResponse {

    public constructor(
        members: CommunityMemberDTO[],
        communitySize: number
    ) {
        this.Members        = members;
        this.CommunitySize  = communitySize;
    }

    public Members: CommunityMemberDTO[];

    public CommunitySize: number;

}
