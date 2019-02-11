import { injectable }              from "inversify";
import * as _                      from "lodash";
import { IEmailService }           from "./IEmailService";
import {
        AdminInviteManagedUserEmailDTO,
        AdminUpdateUserEmailDTO,
        CreateAccountEmailDTO,
        ResetPasswordEmailDTO }    from "../dtos";
import { UserRoleType }            from "../enums";
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
            service: config.mailer.host,
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
            `${config.client.baseURL}/${config.client.endpoints.createProfileResource}/?registrationID=${model.UserRegistrationID}&email=${model.UserEmailAddress}`);

        const mailOptions = {
            from: `${config.application.name} <${config.application.email}>`,
            to: model.UserEmailAddress,
            subject: `${config.application.name} registration`,
            html: finishRegistrationHTML
        };

        this._transporter.sendMail(mailOptions, (error: any, info: any) => {
            if (error) {
                return console.log(error);
            }
        });
    }

    public async sendAdminInviteManagedUserEmail(model: AdminInviteManagedUserEmailDTO): Promise<void> {

        let inviteManagedUserHTML: string = fs.readFileSync(path.join(process.cwd(), "src/views/emails", "AdminInviteUser.html"), "utf8");
        inviteManagedUserHTML             = inviteManagedUserHTML.replace("{0}", (_.invert(UserRoleType))[model.ReceiverRole].toLowerCase());
        inviteManagedUserHTML             = inviteManagedUserHTML.replace("{1}", model.SenderEmailAddres);
        inviteManagedUserHTML             = inviteManagedUserHTML.replace("{2}", model.SenderEmailAddres);

        inviteManagedUserHTML             = inviteManagedUserHTML.replace("{3}",
            `${config.client.baseURL}/${config.client.endpoints.managedUserRegisterResource}/?registrationID=${model.RegistrationID}&email=${model.ReceiverEmailAddress}`);

        const mailOptions = {
            from: `${config.application.name} <${config.application.email}>`,
            to: model.ReceiverEmailAddress,
            subject: `${config.application.name} registration`,
            html: inviteManagedUserHTML
        };

        this._transporter.sendMail(mailOptions, (error: any, info: any) => {
            if (error) {
                return console.log(error);
            }
        });

    }

    public async sendAdminEnableUserEmail(model: AdminUpdateUserEmailDTO): Promise<void> {

        let enableUserHTML: string = fs.readFileSync(path.join(process.cwd(), "src/views/emails", "AdminEnableUser.html"), "utf8");
        enableUserHTML             = enableUserHTML.replace("{0}", model.ReceiverFullName);
        enableUserHTML             = enableUserHTML.replace("{1}", model.SenderEmailAddres);
        enableUserHTML             = enableUserHTML.replace("{2}", model.SenderEmailAddres);
        enableUserHTML             = enableUserHTML.replace("{3}", model.Message);

        const mailOptions = {
            from: `${config.application.name} <${config.application.email}>`,
            to: model.ReceiverEmailAddress,
            subject: `${config.application.name} account enabled`,
            html: enableUserHTML
        };

        this._transporter.sendMail(mailOptions, (error: any, info: any) => {
            if (error) {
                return console.log(error);
            }
        });

    }

    public async sendAdminDisableUserEmail(model: AdminUpdateUserEmailDTO): Promise<void> {

        let disableUserHTML: string = fs.readFileSync(path.join(process.cwd(), "src/views/emails", "AdminDisableUser.html"), "utf8");
        disableUserHTML             = disableUserHTML.replace("{0}", model.ReceiverFullName);
        disableUserHTML             = disableUserHTML.replace("{1}", model.SenderEmailAddres);
        disableUserHTML             = disableUserHTML.replace("{2}", model.SenderEmailAddres);
        disableUserHTML             = disableUserHTML.replace("{3}", model.Message);

        const mailOptions = {
            from: `${config.application.name} <${config.application.email}>`,
            to: model.ReceiverEmailAddress,
            subject: `${config.application.name} account disabled`,
            html: disableUserHTML
        };

        this._transporter.sendMail(mailOptions, (error: any, info: any) => {
            if (error) {
                return console.log(error);
            }
        });

    }

    public async sendAdminDeleteUserEmail(model: AdminUpdateUserEmailDTO): Promise<void> {

        let deleteUserHTML: string = fs.readFileSync(path.join(process.cwd(), "src/views/emails", "AdminDeleteUser.html"), "utf8");
        deleteUserHTML             = deleteUserHTML.replace("{0}", model.ReceiverFullName);
        deleteUserHTML             = deleteUserHTML.replace("{1}", model.SenderEmailAddres);
        deleteUserHTML             = deleteUserHTML.replace("{2}", model.SenderEmailAddres);
        deleteUserHTML             = deleteUserHTML.replace("{3}", model.Message);

        const mailOptions = {
            from: `${config.application.name} <${config.application.email}>`,
            to: model.ReceiverEmailAddress,
            subject: `${config.application.name} account deleted`,
            html: deleteUserHTML
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
            `${config.client.baseURL}/${config.client.endpoints.resetPasswordResource}/?resetForgottenPasswordID=${model.UserResetForgottenPasswordID}&email=${model.UserEmaiAddress}`);

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
