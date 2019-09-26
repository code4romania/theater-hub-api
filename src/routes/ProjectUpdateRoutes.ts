import { container }                 from "../config/inversify.config";
import { TYPES }                     from "../types/custom-types";
import { IProjectUpdatesController,
        IEntitiesValidators }        from "../contracts";
import { Request, Response }         from "express";
import { authorizationMiddleware }   from "../middlewares";

export default (app: any) => {

    const projectUpdatesController: IProjectUpdatesController   = container.get<IProjectUpdatesController>(TYPES.ProjectUpdatesController);
    const entitiesValidators: IEntitiesValidators               = container.get<IEntitiesValidators>(TYPES.EntitiesValidators);

    app.post("/api/projects/:projectID/updates",             entitiesValidators.getProjectNeedsValidators(), authorizationMiddleware,
                                                                (req: Request, res: Response) => projectUpdatesController.create(req, res));
    app.get("/api/projects/:projectID/updates",               authorizationMiddleware, (req: Request, res: Response) => projectUpdatesController.getAll(req, res));
    app.get("/api/projects/:projectID/updates/:updateID",     authorizationMiddleware, (req: Request, res: Response) => projectUpdatesController.getByID(req, res));
    app.patch("/api/projects/:projectID/updates/:updateID",     entitiesValidators.getProjectNeedsValidators(), authorizationMiddleware,
                                                                (req: Request, res: Response) => projectUpdatesController.update(req, res));
    app.delete("/api/projects/:projectID/updates/:updateID", authorizationMiddleware, (req: Request, res: Response) => projectUpdatesController.deleteByID(req, res));

};
