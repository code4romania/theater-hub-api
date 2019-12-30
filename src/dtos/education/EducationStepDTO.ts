import { Education } from "../../models";

export class EducationStepDTO {

    public constructor(educationStep: Education) {

        this.ID             = educationStep.ID;
        this.Title          = educationStep.Title;
        this.Institution    = educationStep.Institution;
        this.Description    = educationStep.Description;
        this.StartDate      = educationStep.StartDate;
        this.EndDate        = educationStep.EndDate;
    }

    public ID: string;

    public Title: string;

    public Institution: string;

    public Description: string;

    public StartDate: Date;

    public EndDate?: Date;

}
