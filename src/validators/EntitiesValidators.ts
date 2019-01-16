import { inject, injectable }      from "inversify";
const { check }                    = require("express-validator/check");
import { IEntitiesValidators }     from "./IEntitiesValidators";
import { SocialMediaCategoryType } from "../enums";
import { Validators }              from "../utils";

@injectable()
export class EntitiesValidators implements IEntitiesValidators {

    public getAwardValidators() {

        return [
            check("Title").not().isEmpty().withMessage("Title is required")
                .isLength({ max: 50 }).withMessage("Title should have at most 50 characters"),
            check("Issuer").not().isEmpty().withMessage("Issuer is required")
                .isLength({ max: 50 }).withMessage("Issuer should have at most 50 characters"),
            check("Description").optional().isLength({ max: 500 }).withMessage("Description's maximum length is of 500 characters")
        ];
    }

    public getEducationValidators() {

        return [
            check("Title").not().isEmpty().withMessage("Title is required")
                .isLength({ max: 50 }).withMessage("Title should have at most 50 characters"),
            check("Institution").not().isEmpty().withMessage("Institution name is required")
                .isLength({ max: 50 }).withMessage("Institution should have at most 50 characters"),
            check("Description").optional().isLength({ max: 500 }).withMessage("Description's maximum length is of 500 characters")
        ];
    }

    public getExperienceValidators() {

        return [
            check("Position").not().isEmpty().withMessage("Position is required")
                .isLength({ max: 50 }).withMessage("Position should have at most 50 characters"),
            check("Employer").not().isEmpty().withMessage("Employer name is required")
                .isLength({ max: 50 }).withMessage("Employer name should have at most 50 characters"),
            check("Description").optional().isLength({ max: 500 }).withMessage("Description's maximum length is of 500 characters")
        ];
    }

    public getUserVideoValidators() {

        return [
            check("Video").not().isEmpty().withMessage("Video is required").custom((value: string) => {
                if (!Validators.isValidSocialMediaURL(value, SocialMediaCategoryType.Youtube | SocialMediaCategoryType.Vimeo )) {
                    throw new Error("Video link is not a valid Youtube or Vimeo link");
                }

                return true;
            })
        ];
    }

}
