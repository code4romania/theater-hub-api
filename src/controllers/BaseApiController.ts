import { injectable }           from "inversify";
import { Request, Response }    from "express";
import { Validators }           from "../utils";
import { IBaseApiController,
         IBaseService }         from "../contracts";
import { BaseEntity }           from "../models";


@injectable()
export class BaseApiController<T extends BaseEntity> implements IBaseApiController {

    private readonly _service: IBaseService<T>;

    constructor(service: IBaseService<T>) {
        this._service = service;
    }

    public async create(request: Request, response: Response): Promise<void> {

        const entity: T = await this._service.create(request.body);

        response.send(entity);
    }

    public async getAll(request: Request, response: Response): Promise<void> {

        const entities: T[] = await this._service.getAll();

        response.send(entities);
    }

    public async getByID(request: Request, response: Response): Promise<void> {

        if (!request.params.userID || !Validators.isValidUUID(request.params.userID)) {
            response.status(400).json("Incorrect id.");
            response.end();
            return;
        }

        const entity: T = await this._service.getByID(request.params.userID);

        if (!entity) {
            response.status(404).json("Entity not found.");
            response.end();
            return;
        }

        response.send(entity);
    }

    public async update(request: Request, response: Response): Promise<void> {

        if (!request.params.userID || !Validators.isValidUUID(request.params.userID)) {
            response.status(400).json("Incorrect id.");
            response.end();
            return;
        }

        let entity: object = await this._service.getByID(request.params.userID);

        if (!entity) {
            response.status(404).json("Entity not found.");
            response.end();
            return;
        }

        entity = {
            ...entity,
            ...request.body
          };

          entity = await this._service.update(entity as T);

          response.send(entity);
    }

    public async delete(request: Request, response: Response): Promise<void> {

        if (!request.params.userID || !Validators.isValidUUID(request.params.userID)) {
            response.status(400).json("Incorrect id.");
            response.end();
            return;
        }

        let entity: T = await this._service.getByID(request.params.userID);

        if (!entity) {
            response.status(404).json("Entity not found.");
            response.end();
            return;
        }

        entity = await this._service.delete(request.params.userID);

        response.send(entity);
    }

}