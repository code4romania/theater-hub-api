import { IBaseService }     from "./IBaseService";
import { Education }        from "../../models/Education";
import { CreateEducationDTO,
    UpdateEducationDTO }    from "../../dtos";


export interface IEducationService extends IBaseService<Education> {

    createEducationStep(email: string, createEducationDTO: CreateEducationDTO): Promise<Education>;

    updateEducationStep(email: string, updateEducationDTO: UpdateEducationDTO): Promise<Education>;

    deleteEducationStepByID(email: string, educationID: string): Promise<Education>;

}
