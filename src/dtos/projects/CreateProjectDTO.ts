import { ProjectNeed }      from "../../models";
import { CurrencyType }     from "../../enums";


export class CreateProjectDTO {

    public Name: string;

    public Description: string;

    public Date: Date;

    public Budget: number;

    public Currency: CurrencyType;

    public City: string;

    public Needs?: ProjectNeed[];

}
