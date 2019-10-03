import { Tag } from "../../models";

export interface ITagRepository {

    getAll(): Promise<Tag[]>;

    getByID(id: string): Promise<Tag>;

    getByIDs(ids: string[]): Promise<Tag[]>;

}
