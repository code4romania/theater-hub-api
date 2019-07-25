import { injectable, unmanaged }       from "inversify";
import { Repository }                  from "typeorm";
import { IBaseRepository }             from "../contracts";
import { BaseEntity }                  from "../models";

@injectable()
export class BaseRepository<T extends BaseEntity> implements IBaseRepository<T> {

    private readonly _repository: Repository<T>;

    constructor(@unmanaged() repository: Repository<T>) {
        this._repository = repository;
    }

    public async insert(entity: any): Promise<T> {
        return await this._repository.save(entity);
    }

    public async getAll(): Promise<T[]> {
        return await this._repository.find();
    }

    public async getByID(id: string): Promise<T> {
        return await this._repository.findOne(id);
    }

    public async update(entity: any): Promise<T> {
        return await this._repository.save(entity);
    }

    public async delete(entity: T): Promise<T> {
        return await this._repository.remove(entity);
    }

    public async deleteByID(id: string): Promise<T> {
        const entity: T = await this.getByID(id);

        return this.delete(entity);
    }

    public runCreateQueryBuilder(): any {
        return this._repository.createQueryBuilder();
    }

}
