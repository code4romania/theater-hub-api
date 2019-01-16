import { container }                 from "../config/inversify.config";
import { TYPES }                     from "../types/custom-types";
import { IEducationController }      from "../controllers";
import { Request, Response }         from "express";
import { authorizationMiddleware }   from "../middlewares";
import { IEntitiesValidators }       from "../validators";

export default (app: any) => {

    const educationController: IEducationController = container.get<IEducationController>(TYPES.EducationController);
    const entitiesValidators: IEntitiesValidators   = container.get<IEntitiesValidators>(TYPES.EntitiesValidators);

    app.post("/api/education",                entitiesValidators.getEducationValidators(), authorizationMiddleware,
                                                                       (req: Request, res: Response) => educationController.create(req, res));
    app.get("/api/education",                 authorizationMiddleware, (req: Request, res: Response) => educationController.getAll(req, res));
    app.get("/api/education/:educationID",    authorizationMiddleware, (req: Request, res: Response) => educationController.getByID(req, res));
    app.patch("/api/education",  entitiesValidators.getEducationValidators(), authorizationMiddleware,
                                                                       (req: Request, res: Response) => educationController.update(req, res));
    app.delete("/api/education/:educationID", authorizationMiddleware, (req: Request, res: Response) => educationController.deleteByID(req, res));

};
