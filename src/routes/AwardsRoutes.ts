import { container }                 from "../config/inversify.config";
import { TYPES }                     from "../types/custom-types";
import { IAwardsController,
        IEntitiesValidators }        from "../contracts";
import { Request, Response }         from "express";
import { authorizationMiddleware }   from "../middlewares";

export default (app: any) => {

    const awardsController: IAwardsController     = container.get<IAwardsController>(TYPES.AwardsController);
    const entitiesValidators: IEntitiesValidators = container.get<IEntitiesValidators>(TYPES.EntitiesValidators);

    app.post("/api/awards",            entitiesValidators.getAwardValidators(), authorizationMiddleware,
                                                                (req: Request, res: Response) => awardsController.create(req, res));
    app.get("/api/awards",             authorizationMiddleware, (req: Request, res: Response) => awardsController.getAll(req, res));
    app.get("/api/awards/:awardID",    authorizationMiddleware, (req: Request, res: Response) => awardsController.getByID(req, res));
    app.patch("/api/awards",  entitiesValidators.getAwardValidators(), authorizationMiddleware,
                                                                (req: Request, res: Response) => awardsController.update(req, res));
    app.delete("/api/awards/:awardID", authorizationMiddleware, (req: Request, res: Response) => awardsController.deleteByID(req, res));

};
