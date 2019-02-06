import { inject, injectable }      from "inversify";
import { TYPES }                   from "../types";
import { User }                    from "../models/User";
import { UserImage }               from "../models/UserImage";
import { UserVideo }               from "../models/UserVideo";
import { Award }                   from "../models/Award";
import { Education }               from "../models/Education";
import { Experience }              from "../models/Experience";
import { IAuthenticationService,
         IUserService }            from "../services";
import { Validators }              from "../utils";
import { SocialMediaCategoryType,
           UserAccountStatusType } from "../enums";
import { IUserRoutesValidators }   from "./IUserRoutesValidators";
const { body, check }              = require("express-validator/check");

@injectable()
export class UserRoutesValidators implements IUserRoutesValidators {

    private readonly _authenticationService: IAuthenticationService;
    private readonly _userService: IUserService;

    constructor(@inject(TYPES.AuthenticationService) authenticationService: IAuthenticationService,
                                                        @inject(TYPES.UserService) userService: IUserService) {
        this._authenticationService = authenticationService;
        this._userService           = userService;
    }

    public getRegisterValidators() {

        return [
            check("FirstName").not().isEmpty().withMessage("First name is required")
                              .isLength({ max: 50 }).withMessage("First name should have at most 50 characters"),
            check("LastName").not().isEmpty().withMessage("Last name is required")
                              .isLength({ max: 50 }).withMessage("Last name should have at most 50 characters"),
            check("Email").not().isEmpty().withMessage("E-mail is required")
                          .isLength({ max: 100 }).withMessage("E-mail should have at most 100 characters")
                          .isEmail().withMessage("E-mail must be valid")
                          .custom((value: string) => {
                              return this._userService.getByEmail(value).then((user: User) => {
                                if (user && user.AccountSettings.AccountStatus !== UserAccountStatusType.Registered) {
                                    return Promise.reject("E-mail already in use");
                                }
                              });
                          }),
            check("Password").not().isEmpty().withMessage("Password is required")
                            .custom((value: string) => {
                                if (!Validators.isValidPassword(value)) {
                                    throw new Error("Password must be between 7 and 50 characters long and include upper and lowercase characters");
                                }

                                return true;
                            }),
            check("ConfirmPassword").not().isEmpty().withMessage("Confirm password is required")
                .custom((value: string, { req }: any) => {
                    if (value !== req.body.Password) {
                        throw new Error("Confirm password must match the password");
                    }

                    return true;
                }),
            check("AgreeToTerms").custom((value: boolean) => {
                if (!value) {
                    throw new Error("You have to agree to the Terms of use and Privacy Policy");
                }

                return true;
            })
        ];
    }

    public getFinishRegistrationValidators() {

        return [
            check("Email").not().isEmpty().withMessage("E-mail is required"),
            check("RegistrationID").not().isEmpty().withMessage("Registration ID is required")
                .custom(async (value: string, { req }: any) => {
                    const isValidRegistrationID: boolean = await this._userService.isValidRegistrationID(req.body.Email, value);

                    if (!isValidRegistrationID) {
                        return Promise.reject("Invalid registration ID");
                    }
                })
        ];
    }

    public getForgotPasswordValidators() {

        return [
            check("Email").not().isEmpty().withMessage("E-mail is required")
                .isLength({ max: 100 }).withMessage("E-mail should have at most 100 characters")
                .isEmail().withMessage("E-mail must be valid")
                .custom(async (value: string) => {
                    const user: User = await this._userService.getByEmail(value);

                    if (!user) {
                        return Promise.reject("The user does not exist");
                    }
                })
        ];
    }

    public getResetPasswordValidators() {

        return [
            check("Email").not().isEmpty().withMessage("E-mail is required")
                .isLength({ max: 100 }).withMessage("E-mail should have at most 100 characters")
                .isEmail().withMessage("E-mail must be valid"),
            check("Password").not().isEmpty().withMessage("Password is required")
                .custom((value: string) => {
                    if (!Validators.isValidPassword(value)) {
                        throw new Error("Password must be between 7 and 50 characters long and include upper and lowercase characters");
                    }

                    return true;
                }),
            check("ConfirmPassword").not().isEmpty().withMessage("Confirm password is required")
                .custom((value: string, { req }: any) => {
                    if (value !== req.body.Password) {
                        throw new Error("Confirm password must match the password");
                    }

                    return true;
                }),
            check("ResetForgottenPasswordID").not().isEmpty().withMessage("Reset forgotten password ID is required")
                .custom(async (value: string, { req }: any) => {
                    const isValidResetForgottenPasswordID: boolean
                                = await this._userService.isValidResetForgottenPasswordID(req.body.Email, value);

                    if (!isValidResetForgottenPasswordID) {
                        return Promise.reject("Invalid reset forgotten password ID");
                    }

                    return true;
                })
        ];
    }

    public getSetPasswordValidators() {

        return [
           check("Password").not().isEmpty().withMessage("Current password is required")
               .custom(async (value: string, { req }: any) => {

                    if (!Validators.isValidPassword(value)) {
                       return Promise.reject("Password must be between 7 and 50 characters long and include upper and lowercase characters");
                   }

                    const isPasswordCorrect: boolean = await this._authenticationService.areValidCredentials(req.Principal.Email, value);

                    if (!isPasswordCorrect) {
                       return Promise.reject("Password is invalid");
                   }

                    return true;
               }),
            check("ConfirmNewPassword").not().isEmpty().withMessage("Confirm new password is required")
                .custom((value: string, { req }: any) => {
                    if (value !== req.body.NewPassword) {
                        throw new Error("Confirm new password must match the new password");
                    }

                        return true;
                })
        ];
    }

    public getChangePasswordValidators() {

        return [
           check("Password").not().isEmpty().withMessage("Current password is required")
               .custom(async (value: string, { req }: any) => {

                    if (!Validators.isValidPassword(value)) {
                       return Promise.reject("Password must be between 7 and 50 characters long and include upper and lowercase characters");
                   }

                    const isPasswordCorrect: boolean = await this._authenticationService.areValidCredentials(req.Principal.Email, value);

                    if (!isPasswordCorrect) {
                       return Promise.reject("Password is invalid");
                   }

                    return true;
               }),
           check("NewPassword").not().isEmpty().withMessage("New password is required")
               .custom((value: string) => {
                   if (!Validators.isValidPassword(value)) {
                       throw new Error("Password must be between 7 and 50 characters long and include upper and lowercase characters");
                   }

                    return true;
               }),
           check("ConfirmNewPassword").not().isEmpty().withMessage("Confirm new password is required")
               .custom((value: string, { req }: any) => {
                   if (value !== req.body.NewPassword) {
                       throw new Error("Confirm new password must match the new password");
                   }

                    return true;
               })
       ];
   }

    public getCreateProfile() {

        return [
            check("BirthDate").not().isEmpty().withMessage("Birth date is required")
                .custom((value: string) => {
                    if (!Validators.isValidBirthDate(value)) {
                        throw new Error("You must be at least 18 years old");
                    }

                    return true;
                }),
            check("PhoneNumber").not().isEmpty().withMessage("Phone number is required")
                .custom((value: string) => {
                    if (!Validators.isValidPhoneNumber(value)) {
                        throw new Error("Phone number must be valid");
                    }

                    return true;
                }),
            check("Description").optional().custom((value: string) => {
                if (value.length > 500) {
                    throw new Error("Description's maximum length is of 500 characters");
                }

                return true;
            }),
            check("Website").optional({ nullable: true, checkFalsy: true}).isURL().withMessage("Website must be valid"),
            check("Skills").not().isEmpty().withMessage("Select at least one skill"),
            check("VideoGallery").optional().custom((value: UserVideo[]) => {
                value.forEach(v => {
                    if (!Validators.isValidSocialMediaURL(v.Video, SocialMediaCategoryType.Youtube | SocialMediaCategoryType.Vimeo )) {
                        throw new Error("Video link is not a valid Youtube or Vimeo link");
                    }
                });


                return true;
            }),
            check("Awards").optional().custom((value: Award[]) => {
                let isInvalidAwardTitle: boolean   = false;
                let isInvalidAwardIssuer: boolean  = false;

                for (const award of value) {
                    isInvalidAwardTitle   = isInvalidAwardTitle  || !award.Title;
                    isInvalidAwardIssuer  = isInvalidAwardIssuer || !award.Issuer;

                    if (isInvalidAwardTitle && isInvalidAwardIssuer) {
                        break;
                    }
                }

                if (isInvalidAwardTitle && isInvalidAwardIssuer) {
                    throw new Error("Award title and issuer are required");
                } else if (isInvalidAwardTitle) {
                    throw new Error("Award title is required");
                } else if (isInvalidAwardIssuer) {
                    throw new Error("Award issuer is required");
                }

                return true;
            }),
            check("Experience").optional().custom((value: Experience[]) => {
                let isInvalidExperiencePosition: boolean   = false;
                let isInvalidExperienceEmployer: boolean   = false;

                for (const experience of value) {
                    isInvalidExperiencePosition   = isInvalidExperiencePosition || !experience.Position;
                    isInvalidExperienceEmployer   = isInvalidExperienceEmployer || !experience.Employer;

                    if (isInvalidExperiencePosition && isInvalidExperienceEmployer) {
                        break;
                    }
                }

                if (isInvalidExperiencePosition && isInvalidExperienceEmployer) {
                    throw new Error("Experience position and employer name are required");
                } else if (isInvalidExperiencePosition) {
                    throw new Error("Experience position is required");
                } else if (isInvalidExperienceEmployer) {
                    throw new Error("Experience employer name is required");
                }

                return true;
            }),
            check("Education").optional().custom((value: Education[]) => {
                let isInvalidEducationTitle: boolean             = false;
                let isInvalidEducationInstitutionName: boolean   = false;

                for (const education of value) {
                    isInvalidEducationTitle             = isInvalidEducationTitle || !education.Title;
                    isInvalidEducationInstitutionName   = isInvalidEducationInstitutionName || !education.Institution;

                    if (isInvalidEducationTitle && isInvalidEducationInstitutionName) {
                        break;
                    }
                }

                if (isInvalidEducationTitle && isInvalidEducationInstitutionName) {
                    throw new Error("Education title and institution name are required");
                } else if (isInvalidEducationTitle) {
                    throw new Error("Education title is required");
                } else if (isInvalidEducationInstitutionName) {
                    throw new Error("Education institution name is required");
                }

                return true;
            }),
            check("InstagramLink").optional({ nullable: true, checkFalsy: true}).custom((value: string) => {
                if (!Validators.isValidSocialMediaURL(value, SocialMediaCategoryType.Instagram)) {
                    throw new Error("Invalid Instagram link");
                }

                return true;
            }),
            check("YoutubeLink").optional({ nullable: true, checkFalsy: true}).custom((value: string) => {
                if (!Validators.isValidSocialMediaURL(value, SocialMediaCategoryType.Youtube)) {
                    throw new Error("Invalid Youtube link");
                }

                return true;
            }),
            check("FacebookLink").optional({ nullable: true, checkFalsy: true}).custom((value: string) => {
                if (!Validators.isValidSocialMediaURL(value, SocialMediaCategoryType.Facebook)) {
                    throw new Error("Invalid Facebook link");
                }

                return true;
            }),
            check("LinkedinLink").optional({ nullable: true, checkFalsy: true}).custom((value: string) => {
                if (!Validators.isValidSocialMediaURL(value, SocialMediaCategoryType.Linkedin)) {
                    throw new Error("Invalid Linkedin link");
                }

                return true;
            })
        ];
    }

    public getGeneralInformationValidators() {

        return [
            check("FirstName").not().isEmpty().withMessage("First name is required")
                              .isLength({ max: 50 }).withMessage("First name should have at most 50 characters"),
            check("LastName").not().isEmpty().withMessage("Last name is required")
                              .isLength({ max: 50 }).withMessage("Last name should have at most 50 characters"),
            check("BirthDate").not().isEmpty().withMessage("Birth date is required")
                .custom((value: string) => {
                    if (!Validators.isValidBirthDate(value)) {
                        throw new Error("You must be at least 18 years old");
                    }

                    return true;
                }),
            check("PhoneNumber").not().isEmpty().withMessage("Phone number is required")
                .custom((value: string) => {
                    if (!Validators.isValidPhoneNumber(value)) {
                        throw new Error("Phone number must be valid");
                    }

                    return true;
                }),
            check("Description").optional().custom((value: string) => {
                if (value.length > 500) {
                    throw new Error("Description's maximum length is of 500 characters");
                }

                return true;
            }),
            check("Website").optional({ nullable: true, checkFalsy: true}).isURL().withMessage("Website must be valid"),
            check("InstagramLink").optional({ nullable: true, checkFalsy: true}).custom((value: string) => {
                if (!Validators.isValidSocialMediaURL(value, SocialMediaCategoryType.Instagram)) {
                    throw new Error("Invalid Instagram link");
                }

                return true;
            }),
            check("YoutubeLink").optional({ nullable: true, checkFalsy: true}).custom((value: string) => {
                if (!Validators.isValidSocialMediaURL(value, SocialMediaCategoryType.Youtube)) {
                    throw new Error("Invalid Youtube link");
                }

                return true;
            }),
            check("FacebookLink").optional({ nullable: true, checkFalsy: true}).custom((value: string) => {
                if (!Validators.isValidSocialMediaURL(value, SocialMediaCategoryType.Facebook)) {
                    throw new Error("Invalid Facebook link");
                }

                return true;
            }),
            check("LinkedinLink").optional({ nullable: true, checkFalsy: true}).custom((value: string) => {
                if (!Validators.isValidSocialMediaURL(value, SocialMediaCategoryType.Linkedin)) {
                    throw new Error("Invalid Linkedin link");
                }

                return true;
            })
        ];
    }

    public getSkillsValidators() {

        return [
            body().not().isEmpty().withMessage("Select at least one skill")
        ];
    }

    public getVideoGalleryValidators() {

        return [
            check("AddedEntities").optional().custom((value: UserVideo[]) => {
                value.forEach(v => {
                    if (!Validators.isValidSocialMediaURL(v.Video, SocialMediaCategoryType.Youtube | SocialMediaCategoryType.Vimeo)) {
                        throw new Error("Video link is not a valid Youtube or Vimeo link");
                    }
                });


                return true;
            }),
            check("UpdatedEntities").optional().custom((value: UserVideo[]) => {
                value.forEach(v => {
                    if (!Validators.isValidSocialMediaURL(v.Video, SocialMediaCategoryType.Youtube | SocialMediaCategoryType.Vimeo)) {
                        throw new Error("Video link is not a valid Youtube or Vimeo link");
                    }
                });


                return true;
            })
        ];
    }

    public getAwardsValidators() {

        return [
            check("Awards").optional().custom((value: Award[]) => {
                let isInvalidAwardTitle: boolean   = false;
                let isInvalidAwardIssuer: boolean  = false;

                for (const award of value) {
                    isInvalidAwardTitle   = isInvalidAwardTitle  || !award.Title;
                    isInvalidAwardIssuer  = isInvalidAwardIssuer || !award.Issuer;

                    if (isInvalidAwardTitle && isInvalidAwardIssuer) {
                        break;
                    }
                }

                if (isInvalidAwardTitle && isInvalidAwardIssuer) {
                    throw new Error("Award title and issuer are required");
                } else if (isInvalidAwardTitle) {
                    throw new Error("Award title is required");
                } else if (isInvalidAwardIssuer) {
                    throw new Error("Award issuer is required");
                }

                return true;
            })
        ];
    }

    public getExperienceValidators() {

        return [
            check("Experience").optional().custom((value: Experience[]) => {
                let isInvalidExperiencePosition: boolean   = false;
                let isInvalidExperienceEmployer: boolean   = false;

                for (const experience of value) {
                    isInvalidExperiencePosition   = isInvalidExperiencePosition || !experience.Position;
                    isInvalidExperienceEmployer   = isInvalidExperienceEmployer || !experience.Employer;

                    if (isInvalidExperiencePosition && isInvalidExperienceEmployer) {
                        break;
                    }
                }

                if (isInvalidExperiencePosition && isInvalidExperienceEmployer) {
                    throw new Error("Experience position and employer name are required");
                } else if (isInvalidExperiencePosition) {
                    throw new Error("Experience position is required");
                } else if (isInvalidExperienceEmployer) {
                    throw new Error("Experience employer name is required");
                }

                return true;
            })
        ];
    }

    public getEducationValidators() {

        return [
            check("Education").optional().custom((value: Education[]) => {
                let isInvalidEducationTitle: boolean             = false;
                let isInvalidEducationInstitutionName: boolean   = false;

                for (const education of value) {
                    isInvalidEducationTitle             = isInvalidEducationTitle || !education.Title;
                    isInvalidEducationInstitutionName   = isInvalidEducationInstitutionName || !education.Institution;

                    if (isInvalidEducationTitle && isInvalidEducationInstitutionName) {
                        break;
                    }
                }

                if (isInvalidEducationTitle && isInvalidEducationInstitutionName) {
                    throw new Error("Education title and institution name are required");
                } else if (isInvalidEducationTitle) {
                    throw new Error("Education title is required");
                } else if (isInvalidEducationInstitutionName) {
                    throw new Error("Education institution name is required");
                }

                return true;
            })
        ];
    }

}
