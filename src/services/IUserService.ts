import { IBaseService } from "./IBaseService";
import { User }         from "../models/User";

export interface IUserService extends IBaseService<User> {

    getByEmail(email: string): Promise<User>;
}