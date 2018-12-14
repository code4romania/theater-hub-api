import * as moment                 from "moment";
import * as validator              from "validator";
import { SocialMediaCategoryType } from "../enums";

export class Validators {

    public static readonly _instagramBaseURL: string   = "https://www.instagram.com";
    public static readonly _youtubeBaseURL: string     = "https://www.youtube.com";
    public static readonly _facebookURL: string        = "facebook.com";
    public static readonly _linkedinBaseURL: string    = "https://www.linkedin.com";
    public static readonly _vimeoBaseURL: string       = "https://vimeo.com";

    public static isValidUUID(value: string): boolean {
        return validator.isUUID(value);
    }

    public static isValidEmail(value: string): boolean {
        return validator.isEmail(value);
    }

    public static isValidPhoneNumber(value: string): boolean {
        if (value[0] === "+") {
            value = value.substring(1, value.length);
          }

          if (value[0] === "0") {
            value = value.substring(1, value.length);
          }

          const parsedValue = parseInt(value);

          return !!parsedValue && parsedValue.toString().length === value.length && value.length >= 6;
    }

    public static isValidPassword(value: string): boolean {
        if (value.length < 7 || value.length > 100) {
            return false;
        }

        const lowerCasePassword: string = value.toLowerCase();
        const upperCasePassword: string = value.toUpperCase();

        return lowerCasePassword !== value &&
          upperCasePassword !== value &&
          lowerCasePassword !== upperCasePassword;
    }

    public static isValidBirthDate(value: string): boolean {

        return moment().diff(new Date(value), "years") >= 18;
    }

    public static isValidSocialMediaURL(value: string, socialMediaCategory: SocialMediaCategoryType) {
        if (!validator.isURL(value)) {
            return false;
        }

        if (socialMediaCategory === SocialMediaCategoryType.Instagram) {
          return value.indexOf(this._instagramBaseURL) === 0;
        } else if (socialMediaCategory === SocialMediaCategoryType.Youtube) {
          return value.indexOf(this._youtubeBaseURL) === 0;
        } else if (socialMediaCategory === SocialMediaCategoryType.Facebook) {
          return value.indexOf(this._facebookURL) !== -1;
        } else if (socialMediaCategory === SocialMediaCategoryType.Linkedin) {
          return value.indexOf(this._linkedinBaseURL) === 0;
        } else if (socialMediaCategory === SocialMediaCategoryType.Vimeo) {
          return value.indexOf(this._vimeoBaseURL) === 0;
        } else if (socialMediaCategory === (SocialMediaCategoryType.Youtube | SocialMediaCategoryType.Vimeo)) {
            return value.indexOf(this._youtubeBaseURL) === 0 || value.indexOf(this._vimeoBaseURL) === 0;
        }

        return false;
    }

}
