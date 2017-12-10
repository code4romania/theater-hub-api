import { container }            from "../config/inversify.config";
import { TYPES }                from "../types/custom-types";
import { IUsersController }     from "../controllers";
import { Request, Response }    from "express";

export default (app: any) => {

    const usersController: IUsersController = container.get<IUsersController>(TYPES.UsersController);

    app.get("/api", (req: Request, res: Response) => res.status(200).send({
        message: "Welcome to the Theater HUB API!",
      }));

    app.post("/api/users",               (req: Request, res: Response) => usersController.create(req, res));
    app.get("/api/users",                (req: Request, res: Response) => usersController.getAll(req, res));
    app.get("/api/users/:userID",        (req: Request, res: Response) => usersController.getByID(req, res));
    app.patch("/api/users/:userID",      (req: Request, res: Response) => usersController.update(req, res));
    app.delete("/api/users/:userID",     (req: Request, res: Response) => usersController.delete(req, res));

};
