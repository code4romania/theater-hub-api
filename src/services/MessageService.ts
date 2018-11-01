import { inject, injectable }  from "inversify";
import { TYPES }               from "../types";
import { IMessageService }     from "./IMessageService";
import { BaseService }         from "./BaseService";
import { Message }             from "../models/Message";
import { IMessageRepository }  from "../repositories";

@injectable()
export class MessageService extends BaseService<Message> implements IMessageService {

    private readonly _messageRepository: IMessageRepository;

    constructor(@inject(TYPES.MessageRepository) messageRepository: IMessageRepository) {
        super(messageRepository);
        this._messageRepository = messageRepository;
    }

}
