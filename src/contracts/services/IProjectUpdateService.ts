import { IBaseService }         from "./IBaseService";
import { ProjectUpdate }        from "../../models";
import { CreateProjectUpdateDTO,
    UpdateProjectUpdateDTO }    from "../../dtos";

export interface IProjectUpdateService extends IBaseService<ProjectUpdate> {

    createProjectUpdate(email: string, createProjectUpdateDTO: CreateProjectUpdateDTO): Promise<ProjectUpdate>;

    updateProjectUpdate(email: string, updateProjectUpdateDTO: UpdateProjectUpdateDTO): Promise<ProjectUpdate>;

    deleteProjectUpdateByID(email: string, projectID: string, projectUpdateID: string): Promise<ProjectUpdate>;

}
