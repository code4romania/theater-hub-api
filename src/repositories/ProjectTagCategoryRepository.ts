import { getRepository, Repository }        from "typeorm";
import { injectable }                       from "inversify";
import { ProjectTagCategory }               from "../models";
import { IProjectTagCategoryRepository }    from "../contracts";

@injectable()
export class ProjectTagCategoryRepository implements IProjectTagCategoryRepository {

    private readonly _projectTagCategoryRepository: Repository<ProjectTagCategory>;

    constructor() {
        this._projectTagCategoryRepository = getRepository(ProjectTagCategory);
    }

    public async getAll(): Promise<ProjectTagCategory[]> {
        return await this._projectTagCategoryRepository.find();
    }

    public async getByID(id: string): Promise<ProjectTagCategory> {
        return await this._projectTagCategoryRepository.findOne(id);
    }

    public async getByIDs(ids: string[]): Promise<ProjectTagCategory[]> {
        return await this._projectTagCategoryRepository.findByIds(ids);
    }
}
