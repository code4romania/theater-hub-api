import { container }                       from "../config/inversify.config";
import { TYPES }                           from "../types/custom-types";
import { IAdministrationController }       from "../controllers";
import { authorizationMiddleware }         from "../middlewares";
import { Request, Response }               from "express";

export default (app: any) => {

    const administrationController: IAdministrationController = container.get<IAdministrationController>(TYPES.AdministrationController);

    app.get("/api/administration/users", authorizationMiddleware,
                        (req: Request, res: Response) => administrationController.getUsers(req, res));

    app.post("/api/administration/user", authorizationMiddleware,
                        (req: Request, res: Response) => administrationController.addUser(req, res));

    app.post("/api/administration/user/:userID/enable", authorizationMiddleware,
                        (req: Request, res: Response) => administrationController.enableUser(req, res));

    app.post("/api/administration/user/:userID/disable", authorizationMiddleware,
                        (req: Request, res: Response) => administrationController.disableUser(req, res));

    app.post("/api/administration/user/:userID/delete", authorizationMiddleware,
                        (req: Request, res: Response) => administrationController.deleteUser(req, res));

};
