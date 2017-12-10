import { inject, injectable }    from "inversify";
import { Request, Response }     from "express";
import chalk                     from "chalk";
import * as uuid                 from "uuid/v4";
import { TYPES }                 from "../types";
import { Message }               from "../models/Message";
import { IMessagesController }   from "./IMessagesController";
import { BaseApiController }     from "./BaseApiController";
import { IMessageService }       from "../services";
import { Validators }            from "../utils";

@injectable()
export class MessagesController extends BaseApiController<Message> implements IMessagesController {

    private readonly _messageService: IMessageService;

    constructor(@inject(TYPES.MessageService) messageService: IMessageService) {
        super(messageService);
        this._messageService = messageService;
    }

}