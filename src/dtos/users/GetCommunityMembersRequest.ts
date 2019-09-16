import { SortOrientationType } from "../../enums";

export class GetCommunityMembersRequest {

    public constructor(email: string, searchTerm: string, skillsLiteral: string,
                                    sortOrientation: string,
                                    page: number = 0, pageSize: number = 9,
                                    includePersonalInformation: boolean = false) {

        this.MyEmail                    = email;
        this.SearchTerm                 = searchTerm;
        this.SkillIDs                   = skillsLiteral ? skillsLiteral.split(",").map(s => +s) : [];
        this.SortOrientation            = sortOrientation ? (<any>SortOrientationType)[sortOrientation] : SortOrientationType.ASC;
        this.Page                       = +page;
        this.PageSize                   = +pageSize;
        this.IncludePersonalInformation = includePersonalInformation;

    }

    public MyEmail: string;

    public SearchTerm: string;

    public SortOrientation: SortOrientationType;

    public SkillIDs: number[];

    public IncludePersonalInformation: boolean;

    public Page: number;

    public PageSize: number;

}
