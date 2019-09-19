import { SortOrientationType } from "../../enums";

export class GetEntitiesRequestDTO {

    public constructor(email: string, searchTerm: string, sortOrientation: string,
                                sortCriterion: number, page: number = 0, pageSize: number = 20) {

        this.MyEmail            = email;
        this.SearchTerm         = searchTerm;
        this.SortOrientation    = (<any>SortOrientationType)[sortOrientation];
        this.SortCriterion      = sortCriterion;
        this.Page               = page;
        this.PageSize           = pageSize;

    }

    public MyEmail: string;

    public SearchTerm: string;

    public SortOrientation: SortOrientationType;

    public SortCriterion: number;

    public Page: number;

    public PageSize: number;

}
