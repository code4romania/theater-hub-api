import { inject, injectable }   from "inversify";
import { TYPES }                from "../types";
import { ILocalizationService } from "./ILocalizationService";
import { IProjectService }      from "./IProjectService";
import { BaseService }          from "./BaseService";
import { Project }              from "../models/Project";
import { IProjectRepository }   from "../repositories";

@injectable()
export class ProjectService extends BaseService<Project> implements IProjectService {

    constructor(@inject(TYPES.ProjectRepository) projectRepository: IProjectRepository,
                    @inject(TYPES.LocalizationService) localizationService: ILocalizationService) {
        super(projectRepository, localizationService);
    }

}
