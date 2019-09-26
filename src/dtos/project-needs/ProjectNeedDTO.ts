import { ProjectNeed } from "../../models";

export class ProjectNeedDTO {

    public constructor (projectNeed: ProjectNeed) {
        this.ID          = projectNeed.ID;
        this.Description = projectNeed.Description;
        this.IsMandatory = projectNeed.IsMandatory;
        this.Date        = projectNeed.DateCreated;
        this.ProjectID   = projectNeed.Project ? projectNeed.Project.ID : "";
    }

    public ID: string;

    public Description: string;

    public IsMandatory: boolean;

    public Date?: Date;

    public ProjectID: string;

}
