import { container }             from "../config/inversify.config";
import { TYPES }                 from "../types/custom-types";
import { IWishesController }     from "../controllers";
import { Request, Response }     from "express";

export default (app: any) => {

    const wishesController: IWishesController = container.get<IWishesController>(TYPES.WishesController);

    app.post("/api/wishes",               (req: Request, res: Response) => wishesController.create(req, res));
    app.get("/api/wishes",                (req: Request, res: Response) => wishesController.getAll(req, res));
    app.get("/api/wishes/:wishID",        (req: Request, res: Response) => wishesController.getByID(req, res));
    app.patch("/api/wishes/:wishID",      (req: Request, res: Response) => wishesController.update(req, res));
    app.delete("/api/wishes/:wishID",     (req: Request, res: Response) => wishesController.delete(req, res));

};