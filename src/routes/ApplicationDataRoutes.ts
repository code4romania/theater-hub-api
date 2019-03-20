import { container }                       from "../config/inversify.config";
import { TYPES }                           from "../types/custom-types";
import { IApplicationDataController }      from "../controllers";
import { authorizationMiddleware }         from "../middlewares";
import { Request, Response }               from "express";

export default (app: any) => {

    const applicationDataController: IApplicationDataController = container.get<IApplicationDataController>(TYPES.ApplicationDataController);

    app.get("/api/applicationdata/skills", authorizationMiddleware,
                (req: Request, res: Response) => applicationDataController.getSkills(req, res));

    app.get("/api/applicationdata/locales",
                (req: Request, res: Response) => applicationDataController.getLocales(req, res));

};
