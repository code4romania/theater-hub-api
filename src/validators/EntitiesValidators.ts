import { inject, injectable }      from "inversify";
import { TYPES }                   from "../types";
const { check }                    = require("express-validator/check");
import { IEntitiesValidators,
        ILocalizationService }     from "../contracts";
import { SocialMediaCategoryType } from "../enums";
import { Validators }              from "../utils";

@injectable()
export class EntitiesValidators implements IEntitiesValidators {

    private readonly _localizationService: ILocalizationService;

    constructor(@inject(TYPES.LocalizationService) localizationService: ILocalizationService) {
        this._localizationService   = localizationService;
    }

    public getAwardValidators() {

        return [
            check("Title").not().isEmpty().withMessage((value: string, { req }: any) => {
                    return this._localizationService.getText("validation.award.title.required", req.Locale);
                })
                .isLength({ max: 50 }).withMessage((value: string, { req }: any) => {
                    return this._localizationService.getText("validation.award.title.length", req.Locale);
                }),
            check("Issuer").not().isEmpty().withMessage((value: string, { req }: any) => {
                    return this._localizationService.getText("validation.award.issuer.required", req.Locale);
                })
                .isLength({ max: 50 }).withMessage((value: string, { req }: any) => {
                    return this._localizationService.getText("validation.award.issuer.length", req.Locale);
                }),
            check("Description").optional().isLength({ max: 500 }).withMessage((value: string, { req }: any) => {
                return this._localizationService.getText("validation.award.description.length", req.Locale);
            }),
            check("Date").custom((value: Date, { req }: any) => {
                const currentDate: Date = new Date();

                if (!value || value > currentDate) {
                    throw new Error(this._localizationService.getText("validation.award.date.invalid", req.Locale));
                }

                return true;
            })
        ];
    }

    public getEducationValidators() {

        return [
            check("Title").not().isEmpty().withMessage((value: string, { req }: any) => {
                    return this._localizationService.getText("validation.education.title.required", req.Locale);
                })
                .isLength({ max: 50 }).withMessage((value: string, { req }: any) => {
                    return this._localizationService.getText("validation.education.title.length", req.Locale);
                }),
            check("Institution").not().isEmpty().withMessage((value: string, { req }: any) => {
                    return this._localizationService.getText("validation.education.institution.required", req.Locale);
                })
                .isLength({ max: 50 }).withMessage((value: string, { req }: any) => {
                    return this._localizationService.getText("validation.education.institution.length", req.Locale);
                }),
            check("Description").optional().isLength({ max: 500 }).withMessage((value: string, { req }: any) => {
                return this._localizationService.getText("validation.education.description.length", req.Locale);
            }),
            check("EndDate").custom((value: Date, { req }: any) => {
                const currentDate: Date                 = new Date();
                const isInvalidEducationDateInterval    = !req.StartDate || req.StartDate > currentDate || (value && value < req.StartDate);

                if (!isInvalidEducationDateInterval) {
                    throw new Error(this._localizationService.getText("validation.education.invalid-date-interval", req.Locale));
                }

                return true;
            })
        ];
    }

    public getExperienceValidators() {

        return [
            check("Position").not().isEmpty().withMessage((value: string, { req }: any) => {
                    return this._localizationService.getText("validation.experience.position.required", req.Locale);
                })
                .isLength({ max: 50 }).withMessage((value: string, { req }: any) => {
                    return this._localizationService.getText("validation.experience.position.length", req.Locale);
                }),
            check("Employer").not().isEmpty().withMessage((value: string, { req }: any) => {
                    return this._localizationService.getText("validation.experience.employer.required", req.Locale);
                })
                .isLength({ max: 50 }).withMessage((value: string, { req }: any) => {
                    return this._localizationService.getText("validation.experience.employer.length", req.Locale);
                }),
            check("Description").optional().isLength({ max: 500 }).withMessage((value: string, { req }: any) => {
                return this._localizationService.getText("validation.experience.description.length", req.Locale);
            }),
            check("EndDate").custom((value: Date, { req }: any) => {
                const currentDate: Date                 = new Date();
                const isInvalidExperienceDateInterval   = !req.StartDate || req.StartDate > currentDate || (value && value < req.StartDate);

                if (!isInvalidExperienceDateInterval) {
                    throw new Error(this._localizationService.getText("validation.experience.invalid-date-interval", req.Locale));
                }

                return true;
            })
        ];
    }

    public getUserVideoValidators() {

        return [
            check("Video").not().isEmpty().withMessage((value: string, { req }: any) => {
                return this._localizationService.getText("validation.video.required", req.Locale);
            })
            .custom((value: string, { req }: any) => {
                if (!Validators.isValidSocialMediaURL(value, SocialMediaCategoryType.Youtube | SocialMediaCategoryType.Vimeo )) {
                    throw new Error(this._localizationService.getText("validation.video.invalid", req.Locale));
                }

                return true;
            })
        ];
    }

    public getProjectNeedsValidators() {
        return [
            check("Description").not().isEmpty().withMessage((value: string, { req }: any) => {
                return this._localizationService.getText("validation.project.need.description.required", req.Locale);
            })
            .isLength({ max: 500 }).withMessage((value: string, { req }: any) => {
                return this._localizationService.getText("validation.project.need.description.length", req.Locale);
            })
        ];
    }

    public getProjectUpdatesValidators() {
        return [
            check("Description").not().isEmpty().withMessage((value: string, { req }: any) => {
                return this._localizationService.getText("validation.project.update.description.required", req.Locale);
            })
            .isLength({ max: 500 }).withMessage((value: string, { req }: any) => {
                return this._localizationService.getText("validation.project.update.description.length", req.Locale);
            })
        ];
    }

}
