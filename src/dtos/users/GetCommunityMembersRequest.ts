import { SortOrientationType } from "../../enums";

export class GetCommunityMembersRequest {

    public constructor(email: string, searchTerm: string, skillsLiteral: string,
                                        sortOrientation: string, page: number = 0, pageSize: number = 9) {

        this.MyEmail            = email;
        this.SearchTerm         = searchTerm;
        this.SkillIDs           = skillsLiteral ? skillsLiteral.split(",").map(s => +s) : [];
        this.SortOrientation    = sortOrientation ? (<any>SortOrientationType)[sortOrientation] : SortOrientationType.ASC;
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
