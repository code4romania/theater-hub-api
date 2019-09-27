import { getRepository, Repository }            from "typeorm";
import { injectable }                           from "inversify";
import { ProjectNeedTagCategory }               from "../models";
import { IProjectNeedTagCategoryRepository }    from "../contracts";

@injectable()
export class ProjectNeedTagCategoryRepository implements IProjectNeedTagCategoryRepository {

    private readonly _projectNeedTagCategoryRepository: Repository<ProjectNeedTagCategory>;

    constructor() {
        this._projectNeedTagCategoryRepository = getRepository(ProjectNeedTagCategory);
    }

    public async getAll(): Promise<ProjectNeedTagCategory[]> {
        return await this._projectNeedTagCategoryRepository.find();
    }

    public async getByID(id: string): Promise<ProjectNeedTagCategory> {
        return await this._projectNeedTagCategoryRepository.findOne(id);
    }

    public async getByIDs(ids: string[]): Promise<ProjectNeedTagCategory[]> {
        return await this._projectNeedTagCategoryRepository.findByIds(ids);
    }
}
