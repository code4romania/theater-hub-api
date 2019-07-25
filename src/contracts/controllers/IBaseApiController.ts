import { Request, Response }   from "express";

export interface IBaseApiController {

    create(req: Request, res: Response): Promise<void>;

    getAll(req: Request, res: Response): Promise<void>;

    getByID(req: Request, res: Response): Promise<void>;

    update(req: Request, res: Response): Promise<void>;

    delete(req: Request, res: Response): Promise<void>;
}