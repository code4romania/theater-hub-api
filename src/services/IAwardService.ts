import { IBaseService } from "./IBaseService";
import { Award }        from "../models/Award";
import { CreateAwardDTO,
    UpdateAwardDTO }    from "../dtos";

export interface IAwardService extends IBaseService<Award> {

    createAward(email: string, createAwardDTO: CreateAwardDTO): Promise<Award>;

    updateAward(email: string, updateAwardDTO: UpdateAwardDTO): Promise<Award>;

    deleteAwardByID(email: string, awardID: string): Promise<Award>;

}
