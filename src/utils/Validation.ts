import * as moment                 from "moment";
import * as validator              from "validator";
import { SocialMediaCategoryType } from "../enums";
import * as _                      from "lodash";

export class Validators {

    public static readonly _instagramBaseURL: string   = "instagram.com";
    public static readonly _youtubeBaseURL: string     = "youtube.com";
    public static readonly _facebookURL: string        = "facebook.com";
    public static readonly _linkedinBaseURL: string    = "linkedin.com";
    public static readonly _vimeoBaseURL: string       = "vimeo.com";

    public static isValidUUID(value: string): boolean {
        return validator.isUUID(value);
    }

    public static isValidBudget (budget: any): boolean {
      return _.isNumber(budget) && budget >= 0;
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
          return value.includes(this._instagramBaseURL);
        } else if (socialMediaCategory === SocialMediaCategoryType.Youtube) {
          return value.includes(this._youtubeBaseURL);
        } else if (socialMediaCategory === SocialMediaCategoryType.Facebook) {
          return value.includes(this._facebookURL);
        } else if (socialMediaCategory === SocialMediaCategoryType.Linkedin) {
          return value.includes(this._linkedinBaseURL);
        } else if (socialMediaCategory === SocialMediaCategoryType.Vimeo) {
          return value.includes(this._vimeoBaseURL);
        } else if (socialMediaCategory === (SocialMediaCategoryType.Youtube | SocialMediaCategoryType.Vimeo)) {
            return value.includes(this._youtubeBaseURL) || value.includes(this._vimeoBaseURL);
        }

        return false;
    }

}
