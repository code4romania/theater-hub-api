import { ProjectStatusType, VisibilityType } from "../../enums";
import { Project } from "../../models";

export class DashboardProject {

    public constructor(project: Project) {
        this.ID                 = project.ID;
        this.Name               = project.Name;
        this.City               = project.City;
        this.InitiatorName      = project.Initiator.Name;
        this.InitiatorUsername  = project.Initiator.Username;
        this.Status             = project.Status;
        this.Visibility         = project.Visibility;
    }

    public ID: string;

    public Name: string;

    public City: string;

    public InitiatorUsername: string;

    public InitiatorName: string;

    public Status: ProjectStatusType;

    public Visibility: VisibilityType;

}
