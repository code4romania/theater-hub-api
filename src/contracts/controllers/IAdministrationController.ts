import { Request, Response }   from "express";

export interface IAdministrationController {

    getUsers(req: Request, res: Response): Promise<void>;

    inviteUser(req: Request, res: Response): Promise<void>;

    enableUser(req: Request, res: Response): Promise<void>;

    disableUser(req: Request, res: Response): Promise<void>;

    deleteUser(req: Request, res: Response): Promise<void>;

    getProjects(req: Request, res: Response): Promise<void>;

    enableProject(req: Request, res: Response): Promise<void>;

    disableProject(req: Request, res: Response): Promise<void>;

    deleteProject(req: Request, res: Response): Promise<void>;

}
