import { Experience } from "../../models";

export class ExperienceStepDTO {

    public constructor(experienceStep: Experience) {

        this.ID             = experienceStep.ID;
        this.Position       = experienceStep.Position;
        this.Employer       = experienceStep.Employer;
        this.Description    = experienceStep.Description;
        this.StartDate      = experienceStep.StartDate;
        this.EndDate        = experienceStep.EndDate;
    }

    public ID: string;

    public Position: string;

    public Employer: string;

    public Description: string;

    public StartDate: Date;

    public EndDate?: Date;

}
