import { getRepository, Repository }       from "typeorm";
import { injectable }                      from "inversify";
import { ProjectNeed }                     from "../models";
import { BaseRepository }                  from "./BaseRepository";
import { IProjectNeedRepository }          from "../contracts";

@injectable()
export class ProjectNeedRepository extends BaseRepository<ProjectNeed> implements IProjectNeedRepository {

    private readonly _projectNeedRepository: Repository<ProjectNeed>;

    constructor() {
        super(getRepository(ProjectNeed));
        this._projectNeedRepository = getRepository(ProjectNeed);
    }

}
