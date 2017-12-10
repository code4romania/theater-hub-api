export interface IBaseService<T> {

    create(entity: T): Promise<T>;

    getAll(): Promise<T[]>;

    getByID(id: string): Promise<T>;

    update(entity: T): Promise<T>;

    delete(entity: T): Promise<T>;

    deleteByID(id: string): Promise<T>;

}