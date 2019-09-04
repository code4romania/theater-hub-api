import { IBaseService }     from "./IBaseService";
import { Project }          from "../../models/Project";
import { CreateProjectDTO } from "../../dtos/projects";

export interface IProjectService extends IBaseService<Project> {

    createProject(email: string, createProjectDTO: CreateProjectDTO): Promise<Project>;

}
