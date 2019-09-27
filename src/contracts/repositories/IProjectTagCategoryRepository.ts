import { ProjectTagCategory } from "../../models";

export interface IProjectTagCategoryRepository {

    getAll(): Promise<ProjectTagCategory[]>;

    getByID(id: string): Promise<ProjectTagCategory>;

    getByIDs(ids: string[]): Promise<ProjectTagCategory[]>;

}
