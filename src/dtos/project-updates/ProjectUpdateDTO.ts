import { ProjectUpdate } from "../../models";

export class ProjectUpdateDTO {

    public constructor (projectUpdate: ProjectUpdate) {
        this.ID             = projectUpdate.ID;
        this.Description    = projectUpdate.Description;
        this.Date           = projectUpdate.DateCreated;
        this.ProjectID      = projectUpdate.ID;
    }

    public ID: string;

    public Description: string;

    public Date?: Date;

    public ProjectID: string;

}
