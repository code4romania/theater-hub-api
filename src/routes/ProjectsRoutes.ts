import { container }                 from "../config/inversify.config";
import { TYPES }                     from "../types/custom-types";
import { IProjectsController }       from "../controllers";
import { IProjectRoutesValidators }  from "../validators";
import { Request, Response }         from "express";
import { validatorMiddleware }       from "../middlewares";

export default (app: any) => {

    const projectsController: IProjectsController           = container.get<IProjectsController>(TYPES.ProjectsController);
    const projectRoutesValidators: IProjectRoutesValidators = container.get<IProjectRoutesValidators>(TYPES.ProjectRoutesValidators);

    app.post("/api/projects",                  (req: Request, res: Response) => projectsController.create(req, res));

    app.get("/api/projects",                   (req: Request, res: Response) => projectsController.getAll(req, res));

    app.get("/api/projects/:projectID",        (req: Request, res: Response) => projectsController.getByID(req, res));

    app.patch("/api/projects/:projectID",      (req: Request, res: Response) => projectsController.update(req, res));

    app.delete("/api/projects/:projectID",     (req: Request, res: Response) => projectsController.delete(req, res));

};