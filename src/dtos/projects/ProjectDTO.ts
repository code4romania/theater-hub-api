import { Project }      from "../../models";
import { NeedDTO,
        OtherProjectDTO,
        UpdateDTO }     from ".";
import { CurrencyType}  from "../../enums";

export class ProjectDTO {

    public constructor (project: Project, otherProjects: Project[] = [], includeID: boolean = false) {

        if (includeID) {
            this.ID = project.ID;
        }

        if (project.Initiator.ProfileImage) {
            this.InitiatorImage = project.Initiator.ProfileImage.Location;
        }

        if (project.Image) {
            this.Image = project.Image.Location;
        }

        this.Name           = project.Name;
        this.Description    = project.Description;
        this.InitiatorName  = project.Initiator.Name;
        this.Email          = project.Email;
        this.PhoneNumber    = project.PhoneNumber;
        this.Date           = project.Date;
        this.Budget         = project.Budget;
        this.Currency       = project.Currency;
        this.City           = project.City;
        this.Needs          = project.Needs.map(n => {
            return {
                ID: n.ID,
                Description: n.Description,
                IsMandatory: n.IsMandatory
            };
        });
        this.Updates          = project.Updates.map(u => {
            return {
                ID: u.ID,
                Description: u.Description,
                Date: u.Date
            };
        });
        this.OtherProjects    = otherProjects
                                .filter(p => p.ID !== project.ID)
                                .slice(0, 2)
                                .map(p => {
                                    const image: string = p.Image ?
                                        p.Image.Location :
                                        "";

                                    return {
                                        ID: p.ID,
                                        Name: p.Name,
                                        Image: image
                                    } as OtherProjectDTO;

                                });

    }

    public ID?: string;

    public Name: string;

    public Image?: any;

    public Description: string;

    public InitiatorImage: string;

    public InitiatorName: string;

    public Email: string;

    public PhoneNumber: string;

    public Date: Date;

    public Budget: number;

    public Currency: CurrencyType;

    public City: string;

    public Needs: NeedDTO[];

    public Updates: UpdateDTO[];

    public OtherProjects: OtherProjectDTO[];

}
