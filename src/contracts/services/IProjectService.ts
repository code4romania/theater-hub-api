import { IBaseService }             from "./IBaseService";
import { Project }                  from "../../models/Project";
import { CreateProjectDTO,
        MyProjectDTO,
        ProjectDTO,
        ProjectListItem,
        GetAllProjectsResponse }    from "../../dtos/projects";

export interface IProjectService extends IBaseService<Project> {

    createProject(email: string, createProjectDTO: CreateProjectDTO): Promise<Project>;

    getProject(email: string, id: string): Promise<ProjectDTO>;

    getMyProjects(email: string): Promise<MyProjectDTO[]>;

    getAllProjects(email: string, searchTerm: string, page: number, pageSize: number): Promise<GetAllProjectsResponse>;

    getRandomProjects(count?: number): Promise<ProjectListItem[]>;

    deleteProjectByID(email: string, projectID: string): Promise<Project>;

}
