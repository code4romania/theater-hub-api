import { SocialMediaCategoryType }  from "../enums";
import { Validators }               from "./Validation";

export class SocialMediaManager {

    public static readonly _youtubeBaseURL: string     = "https://www.youtube.com";
    public static readonly _vimeoBaseURL: string       = "https://vimeo.com";

    public static extractYoutubeID (url: string) {
        if (!Validators.isValidSocialMediaURL(url, SocialMediaCategoryType.Youtube)) {
            return;
        }

        let videoID       = "";
        const urlSegments = url.split("v=");
        const index       = urlSegments[urlSegments.length - 1].indexOf("&");
        if (index !== -1) {
            videoID = urlSegments[urlSegments.length - 1].substring(0, index);
        } else {
            videoID = urlSegments[urlSegments.length - 1];
        }

        return videoID;
    }

    public static extractVimeoID (url: string) {
        if (!Validators.isValidSocialMediaURL(url, SocialMediaCategoryType.Vimeo)) {
            return;
        }

        let videoID       = "";
        const urlSegments = url.split("/");
        const index = urlSegments[urlSegments.length - 1].indexOf("&");
        if (index !== -1) {
            videoID = urlSegments[urlSegments.length - 1].substring(0, index);
        } else {
            videoID = urlSegments[urlSegments.length - 1];
        }

        return videoID;
    }

}
