import { container }                       from "../config/inversify.config";
import { TYPES }                           from "../types/custom-types";
import { IAdministrationController,
    IAdministrationRoutesValidators }      from "../contracts";
import { authorizationMiddleware,
    validatorMiddleware }                  from "../middlewares";
import { Request, Response }               from "express";

export default (app: any) => {

    const administrationController: IAdministrationController             = container.get<IAdministrationController>(TYPES.AdministrationController);
    const administrationRoutesValidators: IAdministrationRoutesValidators = container.get<IAdministrationRoutesValidators>(TYPES.AdministrationRoutesValidators);

    app.get("/api/administration/users", authorizationMiddleware,
                        (req: Request, res: Response) => administrationController.getUsers(req, res));

    app.post("/api/administration/users/invite",
                        authorizationMiddleware,
                        administrationRoutesValidators.getInviteUserValidators(),
                        validatorMiddleware,
                        (req: Request, res: Response) => administrationController.inviteUser(req, res));

    app.post("/api/administration/users/:userID/enable", authorizationMiddleware,
                        (req: Request, res: Response) => administrationController.enableUser(req, res));

    app.post("/api/administration/users/:userID/disable", authorizationMiddleware,
                        (req: Request, res: Response) => administrationController.disableUser(req, res));

    app.post("/api/administration/users/:userID/delete", authorizationMiddleware,
                        (req: Request, res: Response) => administrationController.deleteUser(req, res));

    app.get("/api/administration/projects", authorizationMiddleware,
                        (req: Request, res: Response) => administrationController.getProjects(req, res));

    app.post("/api/administration/projects/:projectID/enable", authorizationMiddleware,
                        (req: Request, res: Response) => administrationController.enableProject(req, res));

    app.post("/api/administration/projects/:projectID/disable", authorizationMiddleware,
                        (req: Request, res: Response) => administrationController.disableProject(req, res));

    app.post("/api/administration/projects/:projectID/delete", authorizationMiddleware,
                        (req: Request, res: Response) => administrationController.deleteProject(req, res));

};
