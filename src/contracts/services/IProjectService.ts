import { IBaseService }     from "./IBaseService";
import { Project }          from "../../models/Project";
import { CreateProjectDTO,
                ProjectDTO } from "../../dtos/projects";

export interface IProjectService extends IBaseService<Project> {

    createProject(email: string, createProjectDTO: CreateProjectDTO): Promise<Project>;

    getProject(email: string, id: string): Promise<ProjectDTO>;

}
