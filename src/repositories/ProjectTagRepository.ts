import { getRepository, Repository }        from "typeorm";
import { injectable }                       from "inversify";
import { ProjectTag }                       from "../models";
import { BaseRepository }                   from "./BaseRepository";
import { IProjectTagRepository }            from "../contracts";

@injectable()
export class ProjectTagRepository extends BaseRepository<ProjectTag> implements IProjectTagRepository {

    private readonly _projectTagRepository: Repository<ProjectTag>;

    constructor() {
        super(getRepository(ProjectTag));
        this._projectTagRepository = getRepository(ProjectTag);
    }

}
