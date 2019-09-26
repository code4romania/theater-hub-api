import { getRepository, Repository }       from "typeorm";
import { injectable }                      from "inversify";
import { ProjectUpdate }                   from "../models";
import { BaseRepository }                  from "./BaseRepository";
import { IProjectUpdateRepository }        from "../contracts";

@injectable()
export class ProjectUpdateRepository extends BaseRepository<ProjectUpdate> implements IProjectUpdateRepository {

    private readonly _projectUpdateRepository: Repository<ProjectUpdate>;

    constructor() {
        super(getRepository(ProjectUpdate));
        this._projectUpdateRepository = getRepository(ProjectUpdate);
    }

}
