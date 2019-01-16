import { IBaseService }      from "./IBaseService";
import { Experience }        from "../models/Experience";
import { CreateExperienceDTO,
    UpdateExperienceDTO }    from "../dtos";

export interface IExperienceService extends IBaseService<Experience> {

    createExperienceStep(email: string, createExperienceDTO: CreateExperienceDTO): Promise<Experience>;

    updateExperienceStep(email: string, updateExperienceDTO: UpdateExperienceDTO): Promise<Experience>;

    deleteExperienceStepByID(email: string, experienceID: string): Promise<Experience>;

}
