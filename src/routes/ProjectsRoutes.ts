import { Request, Response }         from "express";
const multer                         = require("multer");
import { container }                 from "../config/inversify.config";
import { TYPES }                     from "../types/custom-types";
import { IProjectsController,
    IProjectRoutesValidators }       from "../contracts";
import { validatorMiddleware,
     authorizationMiddleware,
     getPrincipalIfRequestHasToken } from "../middlewares";

export default (app: any) => {

    const projectsController: IProjectsController           = container.get<IProjectsController>(TYPES.ProjectsController);
    const projectRoutesValidators: IProjectRoutesValidators = container.get<IProjectRoutesValidators>(TYPES.ProjectRoutesValidators);

    const storage   = multer.memoryStorage();
    const upload    = multer({ storage: storage });

    app.post("/api/projects",               authorizationMiddleware,
                                            upload.single("Image"),
                                            projectRoutesValidators.getCreateProjectValidators(),
                                            validatorMiddleware,
                                            (req: Request, res: Response) => projectsController.create(req, res));

    app.get("/api/projects",                (req: Request, res: Response) => projectsController.getAll(req, res));

    app.get("/api/projects/random",         (req: Request, res: Response) => projectsController.getRandom(req, res));

    app.get("/api/projects/:projectID",     getPrincipalIfRequestHasToken,
                                            (req: Request, res: Response) => projectsController.getByID(req, res));

    app.get("/api/projects/me/:projectID",  getPrincipalIfRequestHasToken,
                                            (req: Request, res: Response) => projectsController.getMyProject(req, res));

    app.patch("/api/projects/:projectID",   (req: Request, res: Response) => projectsController.update(req, res));

    app.patch("/api/projects/:projectID/general", authorizationMiddleware,
                                                upload.single("Image"),
                                                projectRoutesValidators.getGeneralInformationValidators(),
                                                validatorMiddleware,
                                                (req: Request, res: Response) => projectsController.updateGeneralInformation(req, res));

    app.delete("/api/projects/:projectID",  authorizationMiddleware,
                                            (req: Request, res: Response) => projectsController.deleteByID(req, res));

};
