import { IBaseRepository } from "./IBaseRepository";
import { Message }         from "../models/Message";

export interface IMessageRepository extends IBaseRepository<Message> {

}
