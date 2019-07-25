import { getRepository, Repository }       from "typeorm";
import { injectable }                      from "inversify";
import { Project }                         from "../models/Project";
import { BaseRepository }                  from "./BaseRepository";
import { IProjectRepository }              from "../contracts";

@injectable()
export class ProjectRepository extends BaseRepository<Project> implements IProjectRepository {

    private readonly _projectRepository: Repository<Project>;

    constructor() {
        super(getRepository(Project));
        this._projectRepository = getRepository(Project);
    }

}