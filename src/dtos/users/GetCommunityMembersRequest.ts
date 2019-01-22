import { SortOrientationType } from "../../enums";

export class GetCommunityMembersRequest {

    public constructor(email: string, searchTerm: string, sortOrientation: string,
                              skillsLiteral: string, page: number = 0, pageSize: number = 9) {

        this.MyEmail            = email;
        this.SearchTerm         = searchTerm;
        this.SortOrientation    = (<any>SortOrientationType)[sortOrientation];
        this.SkillIDs           = skillsLiteral ? skillsLiteral.split(",").map(s => +s) : [];
        this.Page               = +page;
        this.PageSize           = +pageSize;

    }

    public MyEmail: string;

    public SearchTerm: string;

    public SortOrientation: SortOrientationType;

    public SkillIDs: number[];

    public Page: number;

    public PageSize: number;

}
