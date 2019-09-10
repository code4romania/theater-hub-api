import { getRepository, Repository }       from "typeorm";
import { injectable }                      from "inversify";
import { ProjectImage }                    from "../models/ProjectImage";
import { BaseRepository }                  from "./BaseRepository";
import { IProjectImageRepository }         from "../contracts";

@injectable()
export class ProjectImageRepository extends BaseRepository<ProjectImage> implements IProjectImageRepository {

    private readonly _projectImageRepository: Repository<ProjectImage>;

    constructor() {
        super(getRepository(ProjectImage));
        this._projectImageRepository = getRepository(ProjectImage);
    }

}
