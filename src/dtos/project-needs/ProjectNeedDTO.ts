import { ProjectNeed } from "../../models";

export class ProjectNeedDTO {

    public constructor (projectNeed: ProjectNeed) {
        this.ID          = projectNeed.ID;
        this.Description = projectNeed.Description;
        this.Date        = projectNeed.DateCreated;
        this.ProjectID   = projectNeed.Project ? projectNeed.Project.ID : "";

        if (projectNeed.Tags) {
            this.Tags = projectNeed.Tags.map(t => t.ProjectNeedTagCategoryID);
        }
    }

    public ID: string;

    public Description: string;

    public Tags: string[];

    public Date?: Date;

    public ProjectID: string;

}
