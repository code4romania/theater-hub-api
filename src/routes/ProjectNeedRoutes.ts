import { container }                 from "../config/inversify.config";
import { TYPES }                     from "../types/custom-types";
import { IProjectNeedsController,
        IEntitiesValidators }        from "../contracts";
import { Request, Response }         from "express";
import { authorizationMiddleware }   from "../middlewares";

export default (app: any) => {

    const projectNeedsController: IProjectNeedsController   = container.get<IProjectNeedsController>(TYPES.ProjectNeedsController);
    const entitiesValidators: IEntitiesValidators           = container.get<IEntitiesValidators>(TYPES.EntitiesValidators);

    app.post("/api/projects/:projectID/needs",              entitiesValidators.getProjectNeedsValidators(), authorizationMiddleware,
                                                                (req: Request, res: Response) => projectNeedsController.create(req, res));
    app.get("/api/projects/:projectID/needs",               authorizationMiddleware, (req: Request, res: Response) => projectNeedsController.getAll(req, res));
    app.get("/api/projects/:projectID/needs/:needID",       authorizationMiddleware, (req: Request, res: Response) => projectNeedsController.getByID(req, res));
    app.patch("/api/projects/:projectID/needs/:needID",         entitiesValidators.getProjectNeedsValidators(), authorizationMiddleware,
                                                                (req: Request, res: Response) => projectNeedsController.update(req, res));
    app.delete("/api/projects/:projectID/needs/:needID",    authorizationMiddleware, (req: Request, res: Response) => projectNeedsController.deleteByID(req, res));

};
