import { container }                 from "../config/inversify.config";
import { TYPES }                     from "../types/custom-types";
import { IUserVideosController,
            IEntitiesValidators }    from "../contracts";
import { Request, Response }         from "express";
import { authorizationMiddleware }   from "../middlewares";

export default (app: any) => {

    const userVideosController: IUserVideosController = container.get<IUserVideosController>(TYPES.UserVideosController);
    const entitiesValidators: IEntitiesValidators     = container.get<IEntitiesValidators>(TYPES.EntitiesValidators);

    app.post("/api/videos",            entitiesValidators.getUserVideoValidators(), authorizationMiddleware,
                                                                (req: Request, res: Response) => userVideosController.create(req, res));
    app.get("/api/videos",             authorizationMiddleware, (req: Request, res: Response) => userVideosController.getAll(req, res));
    app.get("/api/videos/:videoID",    authorizationMiddleware, (req: Request, res: Response) => userVideosController.getByID(req, res));
    app.patch("/api/videos",  entitiesValidators.getUserVideoValidators(), authorizationMiddleware,
                                                                (req: Request, res: Response) => userVideosController.update(req, res));
    app.delete("/api/videos/:videoID", authorizationMiddleware, (req: Request, res: Response) => userVideosController.deleteByID(req, res));

};
