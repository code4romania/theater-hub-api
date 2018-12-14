import { EntityCategory } from "../models/EntityCategory";

export interface IEntityCategoryRepository {

    getAll(): Promise<EntityCategory[]>;

    getByID(id: string): Promise<EntityCategory>;

    getByIDs(ids: string[]): Promise<EntityCategory[]>;
}
