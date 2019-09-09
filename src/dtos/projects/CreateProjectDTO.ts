import { ProjectNeed }   from "../../models";
import { CurrencyType,
    VisibilityType }     from "../../enums";


export class CreateProjectDTO {

    public Name: string;

    public Image?: any;

    public Description: string;

    public Email: string;

    public PhoneNumber: string;

    public Date: Date;

    public Budget: number;

    public Currency: CurrencyType;

    public City: string;

    public Visibility: VisibilityType;

    public Needs?: ProjectNeed[];

    public DateCreated: Date;

}
