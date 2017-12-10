import { inject, injectable }  from "inversify";
import { TYPES }               from "../types";
import { IProjectService }     from "./IProjectService";
import { BaseService }         from "./BaseService";
import { Project }             from "../models/Project";
import { IProjectRepository }  from "../repositories";

@injectable()
export class ProjectService extends BaseService<Project> implements IProjectService {

    private readonly _projectRepository: IProjectRepository;

    constructor(@inject(TYPES.ProjectRepository) projectRepository: IProjectRepository) {
        super(projectRepository);
        this._projectRepository = projectRepository;
    }

}