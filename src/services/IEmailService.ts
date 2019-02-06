import { AdminAddManagedUserEmailDTO, AdminUpdateUserEmailDTO, CreateAccountEmailDTO, ResetPasswordEmailDTO } from "../dtos";

export interface IEmailService  {

    sendCreateAccountEmail(model: CreateAccountEmailDTO): Promise<void>;

    sendAdminEnableUserEmail(model: AdminUpdateUserEmailDTO): Promise<void>;

    sendAdminDisableUserEmail(model: AdminUpdateUserEmailDTO): Promise<void>;

    sendAdminDeleteUserEmail(model: AdminUpdateUserEmailDTO): Promise<void>;

    sendAdminAddManagedUserEmail(model: AdminAddManagedUserEmailDTO): Promise<void>;

    sendResetPasswordEmail(model: ResetPasswordEmailDTO): Promise<void>;

}
