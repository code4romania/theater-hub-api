import { SortOrientationType, UserSortCriterion } from "../../enums";

export class GetUsersRequestDTO {

    public constructor(email: string, searchTerm: string, sortOrientation: string,
                                sortCriterion: string, page: number = 0, pageSize: number = 20) {

        this.MyEmail            = email;
        this.SearchTerm         = searchTerm;
        this.SortOrientation    = (<any>SortOrientationType)[sortOrientation];
        if (!sortCriterion) {
            this.SortCriterion  = UserSortCriterion.None;
        } else {
            this.SortCriterion  = (<any>UserSortCriterion)[sortCriterion];
        }
        this.Page               = page;
        this.PageSize           = pageSize;

    }

    public MyEmail: string;

    public SearchTerm: string;

    public SortOrientation: SortOrientationType;

    public SortCriterion: UserSortCriterion;

    public Page: number;

    public PageSize: number;

}
