import { CreateAccountEmailDTO, ResetPasswordEmailDTO } from "../dtos";

export interface IEmailService  {

    sendCreateAccountEmail(model: CreateAccountEmailDTO): Promise<void>;

    sendResetPasswordEmail(model: ResetPasswordEmailDTO): Promise<void>;
}
