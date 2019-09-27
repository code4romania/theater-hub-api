import { IBaseService }         from "./IBaseService";
import { ProjectNeed }          from "../../models";
import { CreateProjectNeedDTO,
    UpdateProjectNeedDTO }      from "../../dtos";

export interface IProjectNeedService extends IBaseService<ProjectNeed> {

    createProjectNeed(email: string, createProjectNeedDTO: CreateProjectNeedDTO): Promise<ProjectNeed>;

    updateProjectNeed(email: string, updateProjectNeedDTO: UpdateProjectNeedDTO): Promise<void>;

    deleteProjectNeedByID(email: string, projectID: string, projectNeedID: string): Promise<ProjectNeed>;

}
