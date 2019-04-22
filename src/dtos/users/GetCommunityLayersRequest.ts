
export class GetCommunityLayersRequest {

    public constructor(email: string, searchTerm: string, page: number = 0, pageSize: number = 3) {

        this.MyEmail    = email;
        this.SearchTerm = searchTerm;
        this.Page       = +page;
        this.PageSize   = +pageSize;
    }

    public MyEmail: string;

    public SearchTerm: string;

    public Page: number;

    public PageSize: number;

}
