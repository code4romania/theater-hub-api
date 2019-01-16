import { IBaseService }     from "./IBaseService";
import { UserVideo }        from "../models/UserVideo";
import { CreateUserVideoDTO,
    UpdateUserVideoDTO }    from "../dtos";

export interface IUserVideoService extends IBaseService<UserVideo> {

    createUserVideo(email: string, createUserVideoDTO: CreateUserVideoDTO): Promise<UserVideo>;

    updateUserVideo(email: string, updateUserVideoDTO: UpdateUserVideoDTO): Promise<UserVideo>;

    deleteUserVideoByID(email: string, videoID: string): Promise<UserVideo>;

}
