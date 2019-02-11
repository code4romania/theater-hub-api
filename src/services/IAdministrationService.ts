import { User }                     from "../models";
import { GetUsersRequestDTO,
    GetUsersResponseDTO,
    ManagedUserDTO,
    UpdateUserAccountStatusDTO }    from "../dtos";

export interface IAdministrationService {

    getUsers(getUsersRequestDTO: GetUsersRequestDTO): Promise<GetUsersResponseDTO>;

    inviteUser(adminEmail: string, managedUser: ManagedUserDTO): Promise<User>;

    enableUser(adminEmail: string, userID: string, updateUserAccountStatusDTO: UpdateUserAccountStatusDTO): Promise<void>;

    disableUser(adminEmail: string, userID: string, updateUserAccountStatusDTO: UpdateUserAccountStatusDTO): Promise<void>;

    deleteUser(adminEmail: string, userID: string, updateUserAccountStatusDTO: UpdateUserAccountStatusDTO): Promise<User>;

}
