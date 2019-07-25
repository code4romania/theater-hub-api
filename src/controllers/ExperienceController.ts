import { inject, injectable }       from "inversify";
import { Request, Response }        from "express";
import { TYPES }                    from "../types";
import { Experience }               from "../models/Experience";
import { CreateExperienceDTO,
    UpdateExperienceDTO,
    ExperienceStepDTO }             from "../dtos/experience";
import { IExperienceController,
         IExperienceService }       from "../contracts";
import { BaseApiController }        from "./BaseApiController";

@injectable()
export class ExperienceController extends BaseApiController<Experience> implements IExperienceController {

    private readonly _experienceService: IExperienceService;

    constructor(@inject(TYPES.ExperienceService) experienceService: IExperienceService) {
        super(experienceService);
        this._experienceService = experienceService;
    }

    public async create(request: Request, response: Response): Promise<void> {
        const createExperienceDTO: CreateExperienceDTO = request.body as CreateExperienceDTO;

        const experienceStep = await this._experienceService.createExperienceStep(request.Principal.Email, createExperienceDTO);

        response.send(new ExperienceStepDTO(experienceStep));
    }

    public async update(request: Request, response: Response): Promise<void> {
        const updateExperienceDTO: UpdateExperienceDTO = request.body as UpdateExperienceDTO;

        this._experienceService.setLocale(request.Locale);

        const experienceStep = await this._experienceService.updateExperienceStep(request.Principal.Email, updateExperienceDTO);

        response.send(new ExperienceStepDTO(experienceStep));
    }

    public async deleteByID(request: Request, response: Response): Promise<void> {

        this._experienceService.setLocale(request.Locale);

        const experienceStep = await this._experienceService.deleteExperienceStepByID(request.Principal.Email, request.params.experienceID);

        response.send(new ExperienceStepDTO(experienceStep));
    }

}
