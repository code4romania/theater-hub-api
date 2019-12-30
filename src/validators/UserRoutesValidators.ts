import { inject, injectable }      from "inversify";
import { TYPES }                   from "../types";
import { User }                    from "../models/User";
import { UserVideo }               from "../models/UserVideo";
import { Award }                   from "../models/Award";
import { Education }               from "../models/Education";
import { Experience }              from "../models/Experience";
import { IAuthenticationService,
         ILocalizationService,
         IUserService,
         IUserRoutesValidators }   from "../contracts";
import { Validators }              from "../utils";
import { SocialMediaCategoryType,
           UserAccountStatusType } from "../enums";
const { body, check }              = require("express-validator/check");

@injectable()
export class UserRoutesValidators implements IUserRoutesValidators {

    private readonly _authenticationService: IAuthenticationService;
    private readonly _userService: IUserService;
    private readonly _localizationService: ILocalizationService;

    constructor(@inject(TYPES.AuthenticationService) authenticationService: IAuthenticationService,
                @inject(TYPES.UserService) userService: IUserService,
                @inject(TYPES.LocalizationService) localizationService: ILocalizationService) {
        this._authenticationService = authenticationService;
        this._userService           = userService;
        this._localizationService   = localizationService;
    }

    public getContactValidators () {

        return [
            check("FullName").not().isEmpty().withMessage((value: string, { req }: any) => {
                    return this._localizationService.getText("validation.contact-fullName.required", req.Locale);
                })
                .isLength({ max: 100 }).withMessage((value: string, { req }: any) => {
                    return this._localizationService.getText("validation.contact-fullName.length", req.Locale);
                }),
            check("Email").not().isEmpty().withMessage((value: string, { req }: any) => {
                    return this._localizationService.getText("validation.contact-email.required", req.Locale);
                })
                .isLength({ max: 100 }).withMessage((value: string, { req }: any) => {
                    return this._localizationService.getText("validation.contact-email.length", req.Locale);
                })
                .isEmail().withMessage((value: string, { req }: any) => {
                    return this._localizationService.getText("validation.contact-email.invalid", req.Locale);
                }),
            check("Subject").not().isEmpty().withMessage((value: string, { req }: any) => {
                    return this._localizationService.getText("validation.contact-subject.required", req.Locale);
                })
                .isLength({ max: 50 }).withMessage((value: string, { req }: any) => {
                    return this._localizationService.getText("validation.contact-subject.length", req.Locale);
                }),
            check("Message").not().isEmpty().withMessage((value: string, { req }: any) => {
                    return this._localizationService.getText("validation.contact-message.required", req.Locale);
                })
                .isLength({ max: 500 }).withMessage((value: string, { req }: any) => {
                    return this._localizationService.getText("validation.contact-message.length", req.Locale);
                }),
            check("AgreeToTerms").custom((value: boolean, { req }: any) => {
                    if (!value) {
                        throw new Error(this._localizationService.getText("validation.contact-agree-to-terms.invalid", req.Locale));
                    }

                    return true;
                })
        ];
    }

    public getSubcribeToNewsletterValidators () {

        return [
            check("Email").not().isEmpty().withMessage((value: string, { req }: any) => {
                    return this._localizationService.getText("validation.email.required", req.Locale);
                })
                .isLength({ max: 100 }).withMessage((value: string, { req }: any) => {
                    return this._localizationService.getText("validation.email.length", req.Locale);
                })
                .isEmail().withMessage((value: string, { req }: any) => {
                    return this._localizationService.getText("validation.email.invalid", req.Locale);
                })
        ];
    }

    public getRegisterValidators() {

        return [
            check("FirstName").not().isEmpty().withMessage((value: string, { req }: any) => {
                    return this._localizationService.getText("validation.first-name.required", req.Locale);
                })
                .isLength({ max: 50 }).withMessage((value: string, { req }: any) => {
                    return this._localizationService.getText("validation.first-name.length", req.Locale);
                }),
            check("LastName").not().isEmpty().withMessage((value: string, { req }: any) => {
                    return this._localizationService.getText("validation.last-name.required", req.Locale);
                })
                .isLength({ max: 50 }).withMessage((value: string, { req }: any) => {
                    return this._localizationService.getText("validation.last-name.length", req.Locale);
                }),
            check("Email").not().isEmpty().withMessage((value: string, { req }: any) => {
                    return this._localizationService.getText("validation.email.required", req.Locale);
                })
                .isLength({ max: 100 }).withMessage((value: string, { req }: any) => {
                    return this._localizationService.getText("validation.email.length", req.Locale);
                })
                .isEmail().withMessage((value: string, { req }: any) => {
                    return this._localizationService.getText("validation.email.invalid", req.Locale);
                })
                .custom((value: string, { req }: any) => {
                    return this._userService.getByEmail(value).then((user: User) => {
                      if (user && user.AccountSettings.AccountStatus !== UserAccountStatusType.Registered) {
                          return Promise.reject(this._localizationService.getText("validation.email.in-use", req.Locale));
                      }
                    });
                }),
                check("Password").not().isEmpty().withMessage((value: string, { req }: any) => {
                        return this._localizationService.getText("validation.password.required", req.Locale);
                    })
                    .custom((value: string, { req }: any) => {
                        if (!Validators.isValidPassword(value)) {
                            throw new Error(this._localizationService.getText("validation.password.invalid", req.Locale));
                        }

                        return true;
                    }),
                check("ConfirmPassword").not().isEmpty().withMessage((value: string, { req }: any) => {
                        return this._localizationService.getText("validation.confirm-password.required", req.Locale);
                    })
                    .custom((value: string, { req }: any) => {
                        if (value !== req.body.Password) {
                            throw new Error(this._localizationService.getText("validation.confirm-password.invalid", req.Locale));
                        }

                        return true;
                    }),
                    check("AgreeToTerms").custom((value: boolean, { req }: any) => {
                        if (!value) {
                            throw new Error(this._localizationService.getText("validation.agree-to-terms.invalid", req.Locale));
                        }

                        return true;
                    })
        ];
    }

    public getManagedUserRegisterValidators() {

        return [
            check("FirstName").not().isEmpty().withMessage((value: string, { req }: any) => {
                    return this._localizationService.getText("validation.first-name.required", req.Locale);
                })
                .isLength({ max: 50 }).withMessage((value: string, { req }: any) => {
                    return this._localizationService.getText("validation.first-name.length", req.Locale);
                }),
            check("LastName").not().isEmpty().withMessage((value: string, { req }: any) => {
                    return this._localizationService.getText("validation.last-name.required", req.Locale);
                })
                .isLength({ max: 50 }).withMessage((value: string, { req }: any) => {
                    return this._localizationService.getText("validation.last-name.length", req.Locale);
                }),
            check("Email").not().isEmpty().withMessage((value: string, { req }: any) => {
                    return this._localizationService.getText("validation.email.required", req.Locale);
                })
                .isLength({ max: 100 }).withMessage((value: string, { req }: any) => {
                    return this._localizationService.getText("validation.email.length", req.Locale);
                })
                .isEmail().withMessage((value: string, { req }: any) => {
                    return this._localizationService.getText("validation.email.invalid", req.Locale);
                })
                .custom((value: string, { req }: any) => {
                    return this._userService.getByEmail(value).then((user: User) => {
                        if (user && user.AccountSettings.AccountStatus !== UserAccountStatusType.Managed) {
                            return Promise.reject(this._localizationService.getText("validation.email.in-use", req.Locale));
                        }
                      });
                }),
            check("Password").not().isEmpty().withMessage((value: string, { req }: any) => {
                    return this._localizationService.getText("validation.password.required", req.Locale);
                })
                .custom((value: string, { req }: any) => {
                    if (!Validators.isValidPassword(value)) {
                        throw new Error(this._localizationService.getText("validation.password.invalid", req.Locale));
                    }

                    return true;
                }),
            check("ConfirmPassword").not().isEmpty().withMessage((value: string, { req }: any) => {
                    return this._localizationService.getText("validation.confirm-password.required", req.Locale);
                })
                .custom((value: string, { req }: any) => {
                    if (value !== req.body.Password) {
                        throw new Error(this._localizationService.getText("validation.confirm-password.invalid", req.Locale));
                    }

                    return true;
                }),
            check("AgreeToTerms").custom((value: boolean, { req }: any) => {
                if (!value) {
                    throw new Error(this._localizationService.getText("validation.agree-to-terms.invalid", req.Locale));
                }

                return true;
            }),
            check("RegistrationID").not().isEmpty().withMessage((value: string, { req }: any) => {
                    return this._localizationService.getText("validation.registration-id.required", req.Locale);
                })
                .custom(async (value: string, { req }: any) => {
                    const isValidRegistrationID: boolean = await this._userService.isValidRegistrationID(req.body.Email, value);

                    if (!isValidRegistrationID) {
                        return Promise.reject(this._localizationService.getText("validation.registration-id.invalid", req.Locale));
                    }
                })
        ];
    }

    public getFinishRegistrationValidators() {

        return [
            check("Email").not().isEmpty().withMessage((value: string, { req }: any) => {
                    return this._localizationService.getText("validation.email.required", req.Locale);
                }),
            check("RegistrationID").not().isEmpty().withMessage((value: string, { req }: any) => {
                    return this._localizationService.getText("validation.registration-id.required", req.Locale);
                })
                .custom(async (value: string, { req }: any) => {
                    const isValidRegistrationID: boolean = await this._userService.isValidRegistrationID(req.body.Email, value);

                    if (!isValidRegistrationID) {
                        return Promise.reject(this._localizationService.getText("validation.registration-id.invalid", req.Locale));
                    }
                })
        ];
    }

    public getForgotPasswordValidators() {

        return [
            check("Email").not().isEmpty().withMessage((value: string, { req }: any) => {
                    return this._localizationService.getText("validation.email.required", req.Locale);
                })
                .isLength({ max: 100 }).withMessage((value: string, { req }: any) => {
                    return this._localizationService.getText("validation.email.length", req.Locale);
                })
                .isEmail().withMessage((value: string, { req }: any) => {
                    return this._localizationService.getText("validation.email.invalid", req.Locale);
                })
                .custom(async (value: string, { req }: any) => {
                    const user: User = await this._userService.getByEmail(value);

                    if (!user) {
                        return Promise.reject(this._localizationService.getText("validation.email.non-existent", req.Locale));
                    }
                })
        ];
    }

    public getResetPasswordValidators() {

        return [
            check("Email").not().isEmpty().withMessage((value: string, { req }: any) => {
                    return this._localizationService.getText("validation.email.required", req.Locale);
                })
                .isLength({ max: 100 }).withMessage((value: string, { req }: any) => {
                    return this._localizationService.getText("validation.email.length", req.Locale);
                })
                .isEmail().withMessage((value: string, { req }: any) => {
                    return this._localizationService.getText("validation.email.invalid", req.Locale);
                }),
            check("Password").not().isEmpty().withMessage((value: string, { req }: any) => {
                    return this._localizationService.getText("validation.password.required", req.Locale);
                })
                .custom((value: string, { req }: any) => {
                    if (!Validators.isValidPassword(value)) {
                        throw new Error(this._localizationService.getText("validation.password.invalid", req.Locale));
                    }

                    return true;
                }),
            check("ConfirmPassword").not().isEmpty().withMessage((value: string, { req }: any) => {
                    return this._localizationService.getText("validation.confirm-password.required", req.Locale);
                })
                .custom((value: string, { req }: any) => {
                    if (value !== req.body.Password) {
                        throw new Error(this._localizationService.getText("validation.confirm-password.invalid", req.Locale));
                    }

                    return true;
                }),
            check("ResetForgottenPasswordID").not().isEmpty().withMessage((value: string, { req }: any) => {
                    return this._localizationService.getText("validation.reset-forgotten-password-id.required", req.Locale);
                })
                .custom(async (value: string, { req }: any) => {
                    const isValidResetForgottenPasswordID: boolean
                                = await this._userService.isValidResetForgottenPasswordID(req.body.Email, value);

                    if (!isValidResetForgottenPasswordID) {
                        this._localizationService.setLocale(req.Locale);
                        return Promise.reject(this._localizationService.getText("validation.reset-forgotten-password-id.invalid", req.Locale));
                    }

                    return true;
                })
        ];
    }

    public getChangePasswordValidators() {

        return [
            check("Password").not().isEmpty().withMessage((value: string, { req }: any) => {
                return this._localizationService.getText("validation.password.current-password-required", req.Locale);
            })
            .custom(async (value: string, { req }: any) => {
                this._localizationService.setLocale(req.Locale);

                if (!Validators.isValidPassword(value)) {
                   return Promise.reject(this._localizationService.getText("validation.password.invalid"));
               }

                const isPasswordCorrect: boolean = await this._authenticationService.areValidCredentials(req.Principal.Email, value);

                if (!isPasswordCorrect) {
                   return Promise.reject(this._localizationService.getText("validation.password.incorrect"));
               }

                return true;
           }),
           check("NewPassword").not().isEmpty().withMessage((value: string, { req }: any) => {
                    return this._localizationService.getText("validation.password.new-password-required", req.Locale);
                })
                .custom((value: string, { req }: any) => {

                    if (!Validators.isValidPassword(value)) {
                        throw new Error(this._localizationService.getText("validation.password.invalid", req.Locale));
                    }

                    return true;
                }),
           check("ConfirmNewPassword").not().isEmpty().withMessage((value: string, { req }: any) => {
                    return this._localizationService.getText("validation.confirm-password.confirm-new-password-required", req.Locale);
                })
               .custom((value: string, { req }: any) => {

                    if (value !== req.body.NewPassword) {
                        throw new Error(this._localizationService.getText("validation.confirm-password.confirm-new-password-invalid", req.Locale));
                    }

                    return true;
               })
       ];
   }

    public getCreateProfileValidators() {

        return [
            check("BirthDate").not().isEmpty().withMessage((value: string, { req }: any) => {
                    return this._localizationService.getText("validation.date-of-birth.required", req.Locale);
                })
                .custom((value: string, { req }: any) => {
                    if (!Validators.isValidBirthDate(value)) {

                        throw new Error(this._localizationService.getText("validation.date-of-birth.invalid", req.Locale));
                    }

                    return true;
                }),
            check("PhoneNumber").not().isEmpty().withMessage((value: string, { req }: any) => {
                    return this._localizationService.getText("validation.phone-number.required", req.Locale);
                })
                .custom((value: string, { req }: any) => {
                    if (!Validators.isValidPhoneNumber(value)) {

                        throw new Error(this._localizationService.getText("validation.phone-number.invalid", req.Locale));
                    }

                    return true;
                }),
            check("Description").optional().custom((value: string, { req }: any) => {
                if (value.length > 500) {
                    throw new Error(this._localizationService.getText("validation.description.length", req.Locale));
                }

                return true;
            }),
            check("Website").optional({ nullable: true, checkFalsy: true}).isURL().withMessage((value: string, { req }: any) => {
                return this._localizationService.getText("validation.website.invalid", req.Locale);
            }),
            check("Skills").not().isEmpty().withMessage((value: string, { req }: any) => {
                return this._localizationService.getText("validation.skills.required", req.Locale);
            }),
            check("VideoGallery").optional().custom((value: UserVideo[], { req }: any) => {
                if (!value) {
                    return true;
                }

                const videos: UserVideo[] = typeof value === "string" ? JSON.parse(value) : value;

                videos.forEach(v => {
                    if (!Validators.isValidSocialMediaURL(v.Video, SocialMediaCategoryType.Youtube | SocialMediaCategoryType.Vimeo )) {
                        throw new Error(this._localizationService.getText("validation.video.invalid", req.Locale));
                    }

                });

                return true;
            }),
            check("Awards").optional().custom((value: Award[], { req }: any) => {

                const awards: Award[] = typeof value === "string" ? JSON.parse(value) : value;

                let isInvalidAwardTitle: boolean   = false;
                let isInvalidAwardIssuer: boolean  = false;
                let isInvalidAwardDate: boolean    = false;
                const currentDate: Date            = new Date();

                for (const award of awards) {
                    isInvalidAwardTitle   = isInvalidAwardTitle  || !award.Title;
                    isInvalidAwardIssuer  = isInvalidAwardIssuer || !award.Issuer;
                    isInvalidAwardDate    = isInvalidAwardDate   || !award.Date || award.Date > currentDate;

                    if (isInvalidAwardTitle && isInvalidAwardIssuer && isInvalidAwardDate) {
                        break;
                    }
                }

                this._localizationService.setLocale(req.Locale);

                if (isInvalidAwardTitle && isInvalidAwardIssuer) {
                    throw new Error(this._localizationService.getText("validation.award.fileds-required"));
                } else if (isInvalidAwardTitle) {
                    throw new Error(this._localizationService.getText("validation.award.title.required"));
                } else if (isInvalidAwardIssuer) {
                    throw new Error(this._localizationService.getText("validation.award.issuer.required"));
                } else if (isInvalidAwardDate) {
                    throw new Error(this._localizationService.getText("validation.award.date.invalid"));
                }

                return true;
            }),
            check("Experience").optional().custom((value: Experience[], { req }: any) => {

                const experienceSteps: Experience[] = typeof value === "string" ? JSON.parse(value) : value;

                let isInvalidExperiencePosition: boolean        = false;
                let isInvalidExperienceEmployer: boolean        = false;
                let isInvalidExperienceDateInterval: boolean    = false;
                const currentDate: Date                         = new Date();

                for (const experience of experienceSteps) {
                    isInvalidExperiencePosition     = isInvalidExperiencePosition || !experience.Position;
                    isInvalidExperienceEmployer     = isInvalidExperienceEmployer || !experience.Employer;
                    isInvalidExperienceDateInterval = isInvalidExperienceDateInterval ||
                                                        !experience.StartDate ||
                                                        experience.StartDate > currentDate ||
                                                        (experience.EndDate && experience.EndDate < experience.StartDate);

                    if (isInvalidExperiencePosition && isInvalidExperienceEmployer && isInvalidExperienceDateInterval) {
                        break;
                    }
                }

                this._localizationService.setLocale(req.Locale);

                if (isInvalidExperiencePosition && isInvalidExperienceEmployer) {
                    throw new Error(this._localizationService.getText("validation.experience.fileds-required"));
                } else if (isInvalidExperiencePosition) {
                    throw new Error(this._localizationService.getText("validation.experience.position.required"));
                } else if (isInvalidExperienceEmployer) {
                    throw new Error(this._localizationService.getText("validation.experience.employer.required"));
                } else if (isInvalidExperienceDateInterval) {
                    throw new Error("validation.experience.invalid-date-interval");
                }

                return true;
            }),
            check("Education").optional().custom((value: Education[], { req }: any) => {

                const educationSteps: Education[] = typeof value === "string" ? JSON.parse(value) : value;

                let isInvalidEducationTitle: boolean            = false;
                let isInvalidEducationInstitutionName: boolean  = false;
                let isInvalidEducationDateInterval: boolean     = false;
                const currentDate: Date                         = new Date();

                for (const education of educationSteps) {
                    isInvalidEducationTitle             = isInvalidEducationTitle || !education.Title;
                    isInvalidEducationInstitutionName   = isInvalidEducationInstitutionName || !education.Institution;
                    isInvalidEducationDateInterval      = isInvalidEducationDateInterval ||
                                                            !education.StartDate ||
                                                            education.StartDate > currentDate ||
                                                            (education.EndDate && education.EndDate < education.StartDate);

                    if (isInvalidEducationTitle && isInvalidEducationInstitutionName && isInvalidEducationDateInterval) {
                        break;
                    }
                }

                this._localizationService.setLocale(req.Locale);

                if (isInvalidEducationTitle && isInvalidEducationInstitutionName) {
                    throw new Error(this._localizationService.getText("validation.education.fileds-required"));
                } else if (isInvalidEducationTitle) {
                    throw new Error(this._localizationService.getText("validation.education.title.required"));
                } else if (isInvalidEducationInstitutionName) {
                    throw new Error(this._localizationService.getText("validation.education.institution.required"));
                } else if (isInvalidEducationDateInterval) {
                    throw new Error("validation.education.invalid-date-interval");
                }

                return true;
            }),
            check("InstagramLink").optional({ nullable: true, checkFalsy: true}).custom((value: string, { req }: any) => {
                if (!Validators.isValidSocialMediaURL(value, SocialMediaCategoryType.Instagram)) {
                    throw new Error(this._localizationService.getText("validation.instagram.invalid", req.Locale));
                }

                return true;
            }),
            check("YoutubeLink").optional({ nullable: true, checkFalsy: true}).custom((value: string, { req }: any) => {
                if (!Validators.isValidSocialMediaURL(value, SocialMediaCategoryType.Youtube)) {
                    throw new Error(this._localizationService.getText("validation.youtube.invalid", req.Locale));
                }

                return true;
            }),
            check("FacebookLink").optional({ nullable: true, checkFalsy: true}).custom((value: string, { req }: any) => {
                if (!Validators.isValidSocialMediaURL(value, SocialMediaCategoryType.Facebook)) {
                    throw new Error(this._localizationService.getText("validation.facebook.invalid", req.Locale));
                }

                return true;
            }),
            check("LinkedinLink").optional({ nullable: true, checkFalsy: true}).custom((value: string, { req }: any) => {
                if (!Validators.isValidSocialMediaURL(value, SocialMediaCategoryType.Linkedin)) {
                    throw new Error(this._localizationService.getText("validation.linkedin.invalid", req.Locale));
                }

                return true;
            })
        ];
    }

    public getGeneralInformationValidators() {

        return [
            check("FirstName").not().isEmpty().withMessage((value: string, { req }: any) => {
                    return this._localizationService.getText("validation.first-name.required", req.Locale);
                })
                .isLength({ max: 50 }).withMessage((value: string, { req }: any) => {
                    return this._localizationService.getText("validation.first-name.length", req.Locale);
                }),
            check("LastName").not().isEmpty().withMessage((value: string, { req }: any) => {
                    return this._localizationService.getText("validation.last-name.required", req.Locale);
                })
                .isLength({ max: 50 }).withMessage((value: string, { req }: any) => {
                    return this._localizationService.getText("validation.last-name.length", req.Locale);
                }),
            check("BirthDate").not().isEmpty().withMessage((value: string, { req }: any) => {
                    return this._localizationService.getText("validation.date-of-birth.required", req.Locale);
                })
                .custom((value: string, { req }: any) => {
                    if (!Validators.isValidBirthDate(value)) {
                        throw new Error(this._localizationService.getText("validation.date-of-birth.invalid", req.Locale));
                    }

                    return true;
                }),
            check("PhoneNumber").not().isEmpty().withMessage((value: string, { req }: any) => {
                    return this._localizationService.getText("validation.phone-number.required", req.Locale);
                })
                .custom((value: string, { req }: any) => {
                    if (!Validators.isValidPhoneNumber(value)) {
                        throw new Error(this._localizationService.getText("validation.phone-number.invalid", req.Locale));
                    }

                    return true;
                }),
            check("Description").optional().custom((value: string, { req }: any) => {
                if (value.length > 500) {
                    throw new Error(this._localizationService.getText("validation.description.length", req.Locale));
                }

                return true;
            }),
            check("Website").optional({ nullable: true, checkFalsy: true}).isURL().withMessage((value: string, { req }: any) => {
                return this._localizationService.getText("validation.website.invalid", req.Locale);
            }),
            check("InstagramLink").optional({ nullable: true, checkFalsy: true}).custom((value: string, { req }: any) => {
                if (!Validators.isValidSocialMediaURL(value, SocialMediaCategoryType.Instagram)) {
                    throw new Error(this._localizationService.getText("validation.instagram.invalid", req.Locale));
                }

                return true;
            }),
            check("YoutubeLink").optional({ nullable: true, checkFalsy: true}).custom((value: string, { req }: any) => {
                if (!Validators.isValidSocialMediaURL(value, SocialMediaCategoryType.Youtube)) {
                    throw new Error(this._localizationService.getText("validation.youtube.invalid", req.Locale));
                }

                return true;
            }),
            check("FacebookLink").optional({ nullable: true, checkFalsy: true}).custom((value: string, { req }: any) => {
                if (!Validators.isValidSocialMediaURL(value, SocialMediaCategoryType.Facebook)) {
                    throw new Error(this._localizationService.getText("validation.facebook.invalid", req.Locale));
                }

                return true;
            }),
            check("LinkedinLink").optional({ nullable: true, checkFalsy: true}).custom((value: string, { req }: any) => {
                if (!Validators.isValidSocialMediaURL(value, SocialMediaCategoryType.Linkedin)) {
                    throw new Error(this._localizationService.getText("validation.linkedin.invalid", req.Locale));
                }

                return true;
            })
        ];
    }

    public getSkillsValidators() {

        return [
            body().not().isEmpty().withMessage((value: string, { req }: any) => {
                return this._localizationService.getText("validation.skills.required", req.Locale);
            })
        ];
    }

    public getVideoGalleryValidators() {

        return [
            check("AddedEntities").optional().custom((value: UserVideo[], { req }: any) => {
                value.forEach(v => {
                    if (!Validators.isValidSocialMediaURL(v.Video, SocialMediaCategoryType.Youtube | SocialMediaCategoryType.Vimeo)) {
                        throw new Error(this._localizationService.getText("validation.video.invalid", req.Locale));
                    }
                });


                return true;
            }),
            check("UpdatedEntities").optional().custom((value: UserVideo[], { req }: any) => {
                value.forEach(v => {
                    if (!Validators.isValidSocialMediaURL(v.Video, SocialMediaCategoryType.Youtube | SocialMediaCategoryType.Vimeo)) {
                        throw new Error(this._localizationService.getText("validation.video.invalid", req.Locale));
                    }
                });


                return true;
            })
        ];
    }

    public getAwardsValidators() {

        return [
            check("Awards").optional().custom((value: Award[], { req }: any) => {
                let isInvalidAwardTitle: boolean   = false;
                let isInvalidAwardIssuer: boolean  = false;

                for (const award of value) {
                    isInvalidAwardTitle   = isInvalidAwardTitle  || !award.Title;
                    isInvalidAwardIssuer  = isInvalidAwardIssuer || !award.Issuer;

                    if (isInvalidAwardTitle && isInvalidAwardIssuer) {
                        break;
                    }
                }

                this._localizationService.setLocale(req.Locale);

                if (isInvalidAwardTitle && isInvalidAwardIssuer) {
                    throw new Error(this._localizationService.getText("validation.award.fileds-required"));
                } else if (isInvalidAwardTitle) {
                    throw new Error(this._localizationService.getText("validation.award.title.required"));
                } else if (isInvalidAwardIssuer) {
                    throw new Error(this._localizationService.getText("validation.award.issuer.required"));
                }

                return true;
            })
        ];
    }

    public getExperienceValidators() {

        return [
            check("Experience").optional().custom((value: Experience[], { req }: any) => {
                let isInvalidExperiencePosition: boolean   = false;
                let isInvalidExperienceEmployer: boolean   = false;

                for (const experience of value) {
                    isInvalidExperiencePosition   = isInvalidExperiencePosition || !experience.Position;
                    isInvalidExperienceEmployer   = isInvalidExperienceEmployer || !experience.Employer;

                    if (isInvalidExperiencePosition && isInvalidExperienceEmployer) {
                        break;
                    }
                }

                this._localizationService.setLocale(req.Locale);

                if (isInvalidExperiencePosition && isInvalidExperienceEmployer) {
                    throw new Error(this._localizationService.getText("validation.experience.fileds-required"));
                } else if (isInvalidExperiencePosition) {
                    throw new Error(this._localizationService.getText("validation.experience.position.required"));
                } else if (isInvalidExperienceEmployer) {
                    throw new Error(this._localizationService.getText("validation.experience.employer.required"));
                }

                return true;
            })
        ];
    }

    public getEducationValidators() {

        return [
            check("Education").optional().custom((value: Education[], { req }: any) => {
                let isInvalidEducationTitle: boolean             = false;
                let isInvalidEducationInstitutionName: boolean   = false;

                for (const education of value) {
                    isInvalidEducationTitle             = isInvalidEducationTitle || !education.Title;
                    isInvalidEducationInstitutionName   = isInvalidEducationInstitutionName || !education.Institution;

                    if (isInvalidEducationTitle && isInvalidEducationInstitutionName) {
                        break;
                    }
                }

                this._localizationService.setLocale(req.Locale);

                if (isInvalidEducationTitle && isInvalidEducationInstitutionName) {
                    throw new Error(this._localizationService.getText("validation.education.fileds-required"));
                } else if (isInvalidEducationTitle) {
                    throw new Error(this._localizationService.getText("validation.education.title.required"));
                } else if (isInvalidEducationInstitutionName) {
                    throw new Error(this._localizationService.getText("validation.education.institution.required"));
                }

                return true;
            })
        ];
    }

}
