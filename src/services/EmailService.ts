import { injectable }              from "inversify";
import { IEmailService }           from "./IEmailService";
import { CreateAccountEmailDTO,
        ResetPasswordEmailDTO }    from "../dtos";
const config                       = require("../config/env").getConfig();
const nodemailer                   = require("nodemailer");
const fs                           = require("fs");
const path                         = require("path");

@injectable()
export class EmailService implements IEmailService {

    private readonly _transporter: any;

    constructor() {

        this._transporter = nodemailer.createTransport({
            host: config.mailer.host,
            port: config.mailer.port,
            secure: config.mailer.secure,
            auth: {
                user: config.mailer.user,
                pass: config.mailer.pass
            }
        });

    }

    public async sendCreateAccountEmail(model: CreateAccountEmailDTO): Promise<void> {

        let finishRegistrationHTML: string = fs.readFileSync(path.join(process.cwd(), "src/views/emails", "FinishRegistration.html"), "utf8");
        finishRegistrationHTML             = finishRegistrationHTML.replace("{0}", model.UserFullName);
        finishRegistrationHTML             = finishRegistrationHTML.replace("{1}",
            `${config.client.baseURL}/${config.client.endpoints.createProfileResource}?registrationID=${model.UserRegistrationID}&email=${model.UserEmaiAddress}`);

        const mailOptions = {
            from: `${config.application.name} <${config.application.email}>`,
            to: model.UserEmaiAddress,
            subject: `${config.application.name} registration`,
            html: finishRegistrationHTML
        };

        this._transporter.sendMail(mailOptions, (error: any, info: any) => {
            if (error) {
                return console.log(error);
            }
        });
    }

    public async sendResetPasswordEmail(model: ResetPasswordEmailDTO): Promise<void> {

        let resetPasswordHTML: string = fs.readFileSync(path.join(process.cwd(), "src/views/emails", "ResetPassword.html"), "utf8");
        resetPasswordHTML             = resetPasswordHTML.replace("{0}", model.UserFullName);
        resetPasswordHTML             = resetPasswordHTML.replace("{1}",
            `${config.client.baseURL}/${config.client.endpoints.resetPasswordResource}?resetForgottenPasswordID=${model.UserResetForgottenPasswordID}&email=${model.UserEmaiAddress}`);

        const mailOptions = {
            from: `${config.application.name} <${config.application.email}>`,
            to: model.UserEmaiAddress,
            subject: `${config.application.name} password reset`,
            html: resetPasswordHTML
        };

        this._transporter.sendMail(mailOptions, (error: any, info: any) => {
            if (error) {
                return console.log(error);
            }
        });
    }

}
