import { inject, injectable }       from "inversify";
import { Request, Response }        from "express";
import chalk                        from "chalk";
import * as uuid                    from "uuid/v4";
import { Application }              from "express";
import { TYPES }                    from "../types";
import { Education }                from "../models/Education";
import { CreateEducationDTO,
    UpdateEducationDTO,
    EducationStepDTO }              from "../dtos/education";
import { IEducationController }     from "./IEducationController";
import { BaseApiController }        from "./BaseApiController";
import { IEducationService }        from "../services";

@injectable()
export class EducationController extends BaseApiController<Education> implements IEducationController {

    private readonly _educationService: IEducationService;

    constructor(@inject(TYPES.EducationService) educationService: IEducationService) {
        super(educationService);
        this._educationService = educationService;
    }

    public async create(request: Request, response: Response): Promise<void> {
        const createEducationDTO: CreateEducationDTO = request.body as CreateEducationDTO;

        const educationStep = await this._educationService.createEducationStep(request.Principal.Email, createEducationDTO);

        response.send(new EducationStepDTO(educationStep));
    }

    public async update(request: Request, response: Response): Promise<void> {
        const updateEducationDTO: UpdateEducationDTO = request.body as UpdateEducationDTO;

        this._educationService.setLocale(request.Locale);

        const educationStep = await this._educationService.updateEducationStep(request.Principal.Email, updateEducationDTO);

        response.send(new EducationStepDTO(educationStep));
    }

    public async deleteByID(request: Request, response: Response): Promise<void> {

        this._educationService.setLocale(request.Locale);

        const educationStep = await this._educationService.deleteEducationStepByID(request.Principal.Email, request.params.educationID);

        response.send(new EducationStepDTO(educationStep));
    }

}
