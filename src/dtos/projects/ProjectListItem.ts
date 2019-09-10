import { Project } from "../../models";


export class ProjectListItem {

    public constructor(project: Project) {

        this.ID             = project.ID;
        this.Name           = project.Name;
        this.Abstract       = project.Description.length > 200 ?
                                `${project.Description.substring(0, 200)}...` :
                                project.Description;
        this.Image          = project.Image ? project.Image.Location : "";
        this.City           = project.City;

        if (project.Initiator) {
            this.InitiatorName      = project.Initiator.Name;
            this.InitiatorUsername  = project.Initiator.Username;
        }

    }

    public ID: string;

    public Name: string;

    public Abstract: string;

    public Image: string;

    public City: string;

    public InitiatorUsername: string;

    public InitiatorName: string;

}
