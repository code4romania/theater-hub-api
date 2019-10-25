import { Project, ProjectImage }            from "../../models";
import { ProjectNeedDTO,
        OtherProjectDTO,
        UpdateDTO }                         from "../";
import { CurrencyType, VisibilityType }     from "../../enums";

export class ProjectDTO {

    public constructor (
        project: Project,
        otherProjects: Project[] = [],
        includeID: boolean = true,
        includeInitiator: boolean = true
    ) {

        if (includeID) {
            this.ID = project.ID;
        }

        let initiatorProfileImage: ProjectImage;
        let initiatorName: string;

        if (includeInitiator && project.Initiator) {
            initiatorProfileImage   = project.Initiator.ProfileImage || project.Initiator.PhotoGallery.find(p => p.IsProfileImage);
            initiatorName           = project.Initiator.Name;
        }

        this.Name           = project.Name;
        this.Description    = project.Description;
        this.Image          = project.Image;
        this.InitiatorName  = initiatorName;
        this.InitiatorImage = initiatorProfileImage;
        this.Email          = project.Email;
        this.PhoneNumber    = project.PhoneNumber;
        this.Date           = project.Date;
        this.Budget         = project.Budget;
        this.Currency       = project.Currency;
        this.City           = project.City;
        this.Visibility     = project.Visibility;
        this.IsCompleted    = project.IsCompleted;

        this.Needs          = project.Needs.map(n => {
            return {
                ID: n.ID,
                Description: n.Description,
                Tags: n.Tags ? n.Tags.map(t => t.TagID) : [],
                Date: n.DateCreated,
                ProjectID: project.ID
            };
        }).sort((n1, n2) => new Date(n1.Date).getTime() > new Date(n2.Date).getTime() ? -1 : 1);

        this.Updates          = project.Updates.map(u => {
            return {
                ID: u.ID,
                Description: u.Description,
                Date: u.DateCreated
            };
        }).sort((n1, n2) => new Date(n1.Date).getTime() > new Date(n2.Date).getTime() ? -1 : 1);

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

    public InitiatorImage: ProjectImage;

    public InitiatorName: string;

    public Email: string;

    public PhoneNumber: string;

    public Date: Date;

    public Budget: number;

    public Currency: CurrencyType;

    public City: string;

    public Needs: ProjectNeedDTO[];

    public Updates: UpdateDTO[];

    public OtherProjects: OtherProjectDTO[];

    public Visibility: VisibilityType;

    public IsCompleted?: boolean;

    public Tags?: string[];

}
