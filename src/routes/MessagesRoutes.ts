import { container }               from "../config/inversify.config";
import { TYPES }                   from "../types/custom-types";
import { IMessagesController }     from "../controllers";
import { Request, Response }       from "express";

export default (app: any) => {

    const messagesController: IMessagesController = container.get<IMessagesController>(TYPES.MessagesController);

    app.post("/api/messages",                  (req: Request, res: Response) => messagesController.create(req, res));
    app.get("/api/messages",                   (req: Request, res: Response) => messagesController.getAll(req, res));
    app.get("/api/messages/:messageID",        (req: Request, res: Response) => messagesController.getByID(req, res));
    app.patch("/api/messages/:messageID",      (req: Request, res: Response) => messagesController.update(req, res));
    app.delete("/api/messages/:messageID",     (req: Request, res: Response) => messagesController.delete(req, res));

};