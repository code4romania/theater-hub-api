import { Award, Experience, Education,
                 User, UserImage, UserVideo }         from "../../models";
import { SocialMediaCategoryType, VisibilityType }    from "../../enums";

export class ProfileDTO {

    public constructor(user: User) {

        this.Email        = user.Email;
        this.FirstName    = user.Professional.FirstName;
        this.LastName     = user.Professional.LastName;
        this.ProfileImage = user.ProfileImage;
        this.BirthDate    = user.BirthDate;
        this.PhoneNumber  = user.PhoneNumber;
        this.Description  = user.Description;
        this.Website      = user.Website;

        if (user.Professional.Skills) {
            this.Skills = user.Professional.Skills.map(s => s.Skill.Name);
        }

        this.PhotoGallery   = user.PhotoGallery;
        this.VideoGallery   = user.VideoGallery;
        this.Awards         = user.Awards;
        this.Experience     = user.Professional.Experience;
        this.Education      = user.Professional.Education;

        for (const item of user.SocialMedia) {
            switch (item.SocialMediaCategoryID) {
                case  SocialMediaCategoryType.Instagram:
                    this.InstagramLink = item.Link;
                    break;
                case SocialMediaCategoryType.Youtube:
                    this.YoutubeLink = item.Link;
                    break;
                case SocialMediaCategoryType.Facebook:
                    this.FacebookLink = item.Link;
                    break;
                case SocialMediaCategoryType.Linkedin:
                    this.LinkedinLink = item.Link;
                    break;
            }
        }

        this.ProfileVisibility     = user.AccountSettings.ProfileVisibility;
        this.EmailVisibility       = user.AccountSettings.EmailVisibility;
        this.BirthDateVisibility   = user.AccountSettings.BirthDateVisibility;
        this.PhoneNumberVisibility = user.AccountSettings.PhoneNumberVisibility;

    }

    public Email?: string;

    public FirstName?: string;

    public LastName?: string;

    public RegistrationID?: string;

    // General Information

    public ProfileImage?: UserImage;

    public BirthDate?: Date;

    public PhoneNumber?: string;

    public Description?: string;

    public Website?: string;


    // Skills

    public Skills?: string[];


    // Portfolio

    public PhotoGallery?: UserImage[];

    public VideoGallery?: UserVideo[];


    // Awards

    Awards?: Award[];


    // Experience

    Experience?: Experience[];


    // Education

    Education?: Education[];


    // Social media

    public InstagramLink?: string;

    public YoutubeLink?: string;

    public FacebookLink?: string;

    public LinkedinLink?: string;

    // Security

    public ProfileVisibility?: VisibilityType;

    public EmailVisibility?: VisibilityType;

    public BirthDateVisibility?: VisibilityType;

    public PhoneNumberVisibility?: VisibilityType;

}
