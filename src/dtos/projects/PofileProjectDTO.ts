import { Project } from "../../models";

export class PofileProjectDTO {

    constructor (project: Project) {
        this.ID             = project.ID;
        this.Name           = project.Name;
        this.Abstract       = project.Description.length > 200 ?
                                `${project.Description.substring(0, 200)}...` :
                                project.Description;
        this.Image          = project.Image ? project.Image.ThumbnailLocation : "";
    }

    public ID: string;

    public Name: string;

    public Abstract: string;

    public Image?: any;

    public IsCompleted: boolean;

}
