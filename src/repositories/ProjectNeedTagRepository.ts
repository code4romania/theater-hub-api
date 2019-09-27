import { getRepository, Repository }            from "typeorm";
import { injectable }                           from "inversify";
import { ProjectNeedTag }                       from "../models";
import { BaseRepository }                       from "./BaseRepository";
import { IProjectNeedTagRepository }            from "../contracts";

@injectable()
export class ProjectNeedTagRepository extends BaseRepository<ProjectNeedTag> implements IProjectNeedTagRepository {

    private readonly _projectNeedTagRepository: Repository<ProjectNeedTag>;

    constructor() {
        super(getRepository(ProjectNeedTag));
        this._projectNeedTagRepository = getRepository(ProjectNeedTag);
    }

}
