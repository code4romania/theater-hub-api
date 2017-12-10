import { injectable }           from "inversify";
import { IBaseService }         from "./IBaseService";
import { IBaseRepository }      from "../repositories";
import { BaseEntity }           from "../models";

@injectable()
export class BaseService<T extends BaseEntity> implements IBaseService<T> {

    private readonly _repository: IBaseRepository<T>;

    constructor(repository: IBaseRepository<T>) {
        this._repository = repository;
    }

    public async create(entity: T): Promise<T> {
        return this._repository.insert(entity);
    }

    public async getAll(): Promise<T[]> {
        return this._repository.getAll();
    }

    public async getByID(id: string): Promise<T> {
        return this._repository.getByID(id);
    }

    public async update(entity: T): Promise<T> {
        return this._repository.update(entity);
    }

    public async delete(entity: T): Promise<T> {
        return this._repository.delete(entity);
    }

    public async deleteByID(id: string): Promise<T> {
        return this._repository.deleteByID(id);
    }

}