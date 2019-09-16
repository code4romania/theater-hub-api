import { CommunityMemberDTO } from "./index";
import { User } from "../../models";

export class GetCommunityMembersResponse {

    public constructor(users: User[], communitySize: number, includePersonalInformation: boolean = false) {
        this.Members        = users.map(u => new CommunityMemberDTO(u, true, includePersonalInformation));
        this.CommunitySize  = communitySize;
    }

    public Members: CommunityMemberDTO[];

    public CommunitySize: number;

}
