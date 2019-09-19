import { AdminInviteManagedUserEmailDTO, AdminUpdateEntityEmailDTO,
    ContactEmailDTO, CreateAccountEmailDTO, ResetPasswordEmailDTO } from "../../dtos";
import { LocaleType }                                               from "../../enums";

export interface IEmailService  {

    sendCreateAccountEmail(model: CreateAccountEmailDTO): Promise<void>;

    sendAdminEnableUserEmail(model: AdminUpdateEntityEmailDTO): Promise<void>;

    sendAdminDisableUserEmail(model: AdminUpdateEntityEmailDTO): Promise<void>;

    sendAdminDeleteUserEmail(model: AdminUpdateEntityEmailDTO): Promise<void>;

    sendAdminInviteManagedUserEmail(model: AdminInviteManagedUserEmailDTO): Promise<void>;

    sendAdminEnableProjectEmail(model: AdminUpdateEntityEmailDTO): Promise<void>;

    sendAdminDisableProjectEmail(model: AdminUpdateEntityEmailDTO): Promise<void>;

    sendAdminDeleteProjectEmail(model: AdminUpdateEntityEmailDTO): Promise<void>;

    sendContactEmail(model: ContactEmailDTO): Promise<void>;

    sendResetPasswordEmail(model: ResetPasswordEmailDTO): Promise<void>;

    setLocale(locale: LocaleType): void;

}
