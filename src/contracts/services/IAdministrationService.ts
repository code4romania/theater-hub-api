import { User }                     from "../../models";
import { LocaleType }               from "../../enums";
import { DashboardUser,
    DashboardProject,
    GetEntitiesRequestDTO,
    GetEntitiesResponseDTO,
    ManagedUserDTO,
    UpdateEntityStatusDTO }    from "../../dtos";

export interface IAdministrationService {

    getUsers(getUsersRequestDTO: GetEntitiesRequestDTO): Promise<GetEntitiesResponseDTO<DashboardUser>>;

    inviteUser(adminEmail: string, managedUser: ManagedUserDTO): Promise<User>;

    enableUser(adminEmail: string, userID: string, updateUserAccountStatusDTO: UpdateEntityStatusDTO): Promise<void>;

    disableUser(adminEmail: string, userID: string, updateUserAccountStatusDTO: UpdateEntityStatusDTO): Promise<void>;

    deleteUser(adminEmail: string, userID: string, updateUserAccountStatusDTO: UpdateEntityStatusDTO): Promise<User>;

    getProjects(getProjectsRequestDTO: GetEntitiesRequestDTO): Promise<GetEntitiesResponseDTO<DashboardProject>>;

    enableProject(adminEmail: string, projectID: string, updateProjectStatusDTO: UpdateEntityStatusDTO): Promise<void>;

    disableProject(adminEmail: string, projectID: string, updateProjectStatusDTO: UpdateEntityStatusDTO): Promise<void>;

    deleteProject(adminEmail: string, projectID: string, updateProjectStatusDTO: UpdateEntityStatusDTO): Promise<User>;

    setLocale(locale: LocaleType): void;

}
