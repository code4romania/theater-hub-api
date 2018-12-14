import { getRepository, Repository }       from "typeorm";
import { injectable }                      from "inversify";
import { Message }                         from "../models/Message";
import { BaseRepository }                  from "./BaseRepository";
import { IMessageRepository }              from "./IMessageRepository";

@injectable()
export class MessageRepository extends BaseRepository<Message> implements IMessageRepository {

    private readonly _messageRepository: Repository<Message>;

    constructor() {
        super(getRepository(Message));
        this._messageRepository = getRepository(Message);
    }

}
