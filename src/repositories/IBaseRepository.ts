import { BaseEntity } from "../models";

export interface IBaseRepository<T extends BaseEntity> {

    insert(entity: T): Promise<T>;

    getAll(): Promise<T[]>;

    getByID(id: string): Promise<T>;

    update(entity: T): Promise<T>;

    delete(entity: T): Promise<T>;

    deleteByID(id: string): Promise<T>;

    runCreateQueryBuilder(): any;

}
