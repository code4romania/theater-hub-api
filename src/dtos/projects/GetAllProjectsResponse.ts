import { ProjectListItem } from "./";

export class GetAllProjectsResponse {

    public constructor (projects: ProjectListItem[], pageCount: number, page: number, pageSize: number) {
        this.Projects   = projects;
        this.PageCount  = pageCount;
        this.Page       = page;
        this.PageSize   = pageSize;
    }

    public Projects: ProjectListItem[];

    public PageCount: number;

    public Page: number;

    public PageSize: number;

}
