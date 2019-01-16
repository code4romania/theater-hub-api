import { Award } from "../../models";

export class AwardDTO {

    public constructor(award: Award) {

        this.ID          = award.ID;
        this.Title       = award.Title;
        this.Issuer      = award.Issuer;
        this.Description = award.Description;
        this.Date        = award.Date;
    }

    public ID: string;

    public Title: string;

    public Issuer: string;

    public Description: string;

    public Date: Date;

}
