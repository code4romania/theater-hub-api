import { injectable, unmanaged }       from "inversify";
import { getRepository, Repository }   from "typeorm";
import { IBaseRepository }             from "./IBaseRepository";
import { BaseEntity }                  from "../models";

@injectable()
export class BaseRepository<T extends BaseEntity> implements IBaseRepository<T> {

    private readonly _repository: Repository<T>;

    constructor(@unmanaged() repository: Repository<T>) {
        this._repository = repository;
    }

    public async insert(entity: T): Promise<T> {
        return await this._repository.save(entity);
    }

    public async getAll(): Promise<T[]> {
        return await this._repository.find();
    }

    public async getByID(id: string): Promise<T> {
        return await this._repository.findOneById(id);
    }

    public async update(entity: T): Promise<T> {
        return await this._repository.save(entity);
    }

    public async delete(entity: T): Promise<T> {
        return await this._repository.remove(entity);
    }

    public async deleteByID(id: string): Promise<T> {
        const entity: T = await this.getByID(id);

        return this.delete(entity);
    }

}