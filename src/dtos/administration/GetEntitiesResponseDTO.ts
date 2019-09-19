
export class GetEntitiesResponseDTO<T> {

    public constructor(items: T[], total: number, page: number, pageSize: number) {
        this.Data       = items;
        this.Total      = total;
        this.Page       = page;
        this.PageSize   = pageSize;
    }

    public Data: T[];

    public Total: number;

    public Page: number;

    public PageSize: number;

}
