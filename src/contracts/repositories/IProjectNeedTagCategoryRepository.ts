import { ProjectNeedTagCategory } from "../../models";

export interface IProjectNeedTagCategoryRepository {

    getAll(): Promise<ProjectNeedTagCategory[]>;

    getByID(id: string): Promise<ProjectNeedTagCategory>;

    getByIDs(ids: string[]): Promise<ProjectNeedTagCategory[]>;

}
