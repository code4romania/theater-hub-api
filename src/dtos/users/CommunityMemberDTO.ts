import { User }                     from "../../models";
import { SocialMediaCategoryType,
                VisibilityType }    from "../../enums";

export class CommunityMemberDTO {

    public constructor(user: User,
            includeID: boolean = false,
            includePersonalInformation: boolean = false
    ) {
        if (includeID) {
            this.ID = user.ID;
        }

        this.ProfileImage   = user.ProfileImage ? user.ProfileImage.ThumbnailLocation : "";
        this.FirstName      = user.Professional.FirstName;
        this.LastName       = user.Professional.LastName;
        this.Username       = user.Username;
        this.SkillIDs       = user.Professional.Skills ? user.Professional.Skills.map(s => s.ID) : [];

        if (includePersonalInformation) {
            this.Email          = user.AccountSettings.EmailVisibility === VisibilityType.Everyone ? user.Email : undefined;
            this.PhoneNumber    = user.AccountSettings.PhoneNumberVisibility  === VisibilityType.Everyone  ? user.PhoneNumber : undefined;
            this.Website        = user.Website;
            this.BirthDate      = user.AccountSettings.BirthDateVisibility === VisibilityType.Everyone ? user.BirthDate : undefined;
        }

        if (includePersonalInformation && user.SocialMedia) {

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
        }

    }

    public ID: string;

    public ProfileImage: string;

    public FirstName: string;

    public LastName: string;

    public Username: string;

    public SkillIDs: number[];

    public Email?: string;

    public PhoneNumber?: string;

    public Website?: string;

    public InstagramLink?: string;

    public YoutubeLink?: string;

    public FacebookLink?: string;

    public LinkedinLink?: string;

    public BirthDate?: Date;

}
