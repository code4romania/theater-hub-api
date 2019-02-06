import { Request, Response }   from "express";

export interface IAdministrationController {

    getUsers(req: Request, res: Response): Promise<void>;

    addUser(req: Request, res: Response): Promise<void>;

    enableUser(req: Request, res: Response): Promise<void>;

    disableUser(req: Request, res: Response): Promise<void>;

    deleteUser(req: Request, res: Response): Promise<void>;

}
