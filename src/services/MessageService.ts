import { inject, injectable }   from "inversify";
import { TYPES }                from "../types";
import { ILocalizationService } from "./ILocalizationService";
import { IMessageService }      from "./IMessageService";
import { BaseService }          from "./BaseService";
import { Message }              from "../models/Message";
import { IMessageRepository }   from "../repositories";

@injectable()
export class MessageService extends BaseService<Message> implements IMessageService {

    constructor(@inject(TYPES.MessageRepository) messageRepository: IMessageRepository,
                    @inject(TYPES.LocalizationService) localizationService: ILocalizationService) {
        super(messageRepository, localizationService);
    }

}
