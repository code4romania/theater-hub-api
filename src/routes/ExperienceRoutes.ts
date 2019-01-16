import { container }                 from "../config/inversify.config";
import { TYPES }                     from "../types/custom-types";
import { IExperienceController }     from "../controllers";
import { Request, Response }         from "express";
import { authorizationMiddleware }   from "../middlewares";
import { IEntitiesValidators }       from "../validators";

export default (app: any) => {

    const experienceController: IExperienceController = container.get<IExperienceController>(TYPES.ExperienceController);
    const entitiesValidators: IEntitiesValidators     = container.get<IEntitiesValidators>(TYPES.EntitiesValidators);

    app.post("/api/experience",                 entitiesValidators.getExperienceValidators(), authorizationMiddleware,
                                                                         (req: Request, res: Response) => experienceController.create(req, res));
    app.get("/api/experience",                  authorizationMiddleware, (req: Request, res: Response) => experienceController.getAll(req, res));
    app.get("/api/experience/:experienceID",    authorizationMiddleware, (req: Request, res: Response) => experienceController.getByID(req, res));
    app.patch("/api/experience",  entitiesValidators.getExperienceValidators(), authorizationMiddleware,
                                                                         (req: Request, res: Response) => experienceController.update(req, res));
    app.delete("/api/experience/:experienceID", authorizationMiddleware, (req: Request, res: Response) => experienceController.deleteByID(req, res));

};
