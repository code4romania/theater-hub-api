import { inject, injectable }       from "inversify";
import { TYPES }                    from "../types";
import { ProjectNeed }              from "../models/ProjectNeed";
import { IProjectService,
    ILocalizationService,
    IProjectRoutesValidators }      from "../contracts";
import { Validators }               from "../utils";
const { body, check }               = require("express-validator/check");

@injectable()
export class ProjectRoutesValidators implements IProjectRoutesValidators {

    private readonly _projectService: IProjectService;
    private readonly _localizationService: ILocalizationService;

    constructor(@inject(TYPES.ProjectService) projectService: IProjectService,
                @inject(TYPES.LocalizationService) localizationService: ILocalizationService) {
        this._projectService        = projectService;
        this._localizationService   = localizationService;
    }

    public getCreateProjectValidators() {

        return [
            check("Name").not().isEmpty().withMessage((value: string, { req }: any) => {
                    return this._localizationService.getText("validation.project.name.required", req.Locale);
                })
                .isLength({ max: 100 }).withMessage((value: string, { req }: any) => {
                    return this._localizationService.getText("validation.project.name.length", req.Locale);
                }),
            check("City").not().isEmpty().withMessage((value: string, { req }: any) => {
                    return this._localizationService.getText("validation.project.city.required", req.Locale);
                })
                .isLength({ max: 100 }).withMessage((value: string, { req }: any) => {
                    return this._localizationService.getText("validation.project.city.length", req.Locale);
                }),
            check("PhoneNumber")
                .optional()
                .custom((value: string, { req }: any) => {
                    if (!value) {
                        return true;
                    }

                    if (!Validators.isValidPhoneNumber(value)) {
                        throw new Error(this._localizationService.getText("validation.project.phone-number.invalid", req.Locale));
                    }

                    return true;
                }),
            check("Email")
                .optional()
                .isLength({ max: 100 }).withMessage((value: string, { req }: any) => {
                    return this._localizationService.getText("validation.project.email.length", req.Locale);
                })
                .custom((value: string, { req }: any) => {
                    if (!value || Validators.isValidEmail(value)) {
                        return true;
                    }

                    throw new Error(this._localizationService.getText("validation.project.email.invalid", req.Locale));
                }),
            check("Description").optional().custom((value: string, { req }: any) => {
                if (value.length > 5000) {
                    throw new Error(this._localizationService.getText("validation.project.description.length", req.Locale));
                }

                return true;
            }),
            check("Budget").optional().custom((value: string, { req }: any) => {
                if (!Validators.isValidBudget(+value)) {
                    throw new Error(this._localizationService.getText("validation.project.budget.invalid", req.Locale));
                }

                return true;
            }),
            check("Needs").optional().custom((value: ProjectNeed[], { req }: any) => {

                const needs: ProjectNeed[] = typeof value === "string" ? JSON.parse(value) : value;

                for (const need of needs) {
                    if (!need.Description ||
                        need.Description.length === 0 ||
                        need.Description.length > 500) {
                            throw new Error(this._localizationService.getText("validation.experience.fileds-required", req.Locale));
                    }
                }

                return true;
            })
        ];

    }

}
