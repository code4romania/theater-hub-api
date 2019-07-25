import { inject, injectable }      from "inversify";
import { TYPES }                   from "../types";
import * as _                      from "lodash";
import { IEmailService,
        ILocalizationService }     from "../contracts";
import {
        AdminInviteManagedUserEmailDTO,
        AdminUpdateUserEmailDTO,
        CreateAccountEmailDTO,
        ResetPasswordEmailDTO }    from "../dtos";
import { LocaleType,
    UserRoleType }                 from "../enums";
const config                       = require("../config/env").getConfig();
const nodemailer                   = require("nodemailer");
const fs                           = require("fs");
const path                         = require("path");
const handlebars                   = require("handlebars");

@injectable()
export class EmailService implements IEmailService {

    private readonly _transporter: any;
    private readonly _localizationService: ILocalizationService;

    constructor(@inject(TYPES.LocalizationService) localizationService: ILocalizationService) {

        this._localizationService = localizationService;

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

        const finishRegistrationHTML: string = fs.readFileSync(path.join(process.cwd(), "src/views/emails", "FinishRegistration.html"), "utf8");

        const template = handlebars.compile(finishRegistrationHTML);

        const context = {
            greeting: this._localizationService.getText("emails.finish-registration.greeting").replace("{0}", model.UserFullName),
            content1: this._localizationService.getText("emails.finish-registration.content-1"),
            content2: this._localizationService.getText("emails.finish-registration.content-2"),
            applicationName: config.application.name,
            buttonLink: `${config.client.baseURL}/${config.client.endpoints.createProfileResource}/?registrationID=${model.UserRegistrationID}&email=${model.UserEmailAddress}&lang=${this._localizationService.getLocale()}`,
            buttonText: this._localizationService.getText("emails.finish-registration.button")
        };

        const subject     = this._localizationService.getText("emails.finish-registration.subject").replace("{0}", config.application.name);
        const mailOptions = {
            from: `${config.application.name} <${config.application.email}>`,
            to: model.UserEmailAddress,
            subject: subject,
            html: template(context)
        };

        this._transporter.sendMail(mailOptions, (error: any, info: any) => {
            if (error) {
                return console.log(error);
            }
        });
    }

    public async sendAdminInviteManagedUserEmail(model: AdminInviteManagedUserEmailDTO): Promise<void> {

        const inviteManagedUserHTML: string = fs.readFileSync(path.join(process.cwd(), "src/views/emails", "AdminInviteUser.html"), "utf8");

        const template = handlebars.compile(inviteManagedUserHTML);

        const context = {
            greeting: this._localizationService.getText("emails.admin-invite-user.greeting"),
            content1: this._localizationService.getText("emails.admin-invite-user.content-1"),
            content2: this._localizationService.getText("emails.admin-invite-user.content-2").replace("{0}", (_.invert(UserRoleType))[model.ReceiverRole].toLowerCase()),
            applicationName: config.application.name,
            senderEmailAddress: model.SenderEmailAddress,
            buttonLink: `${config.client.baseURL}/${config.client.endpoints.managedUserRegisterResource}/?registrationID=${model.RegistrationID}&email=${model.ReceiverEmailAddress}&lang=${this._localizationService.getLocale()}`,
            buttonText: this._localizationService.getText("emails.admin-invite-user.button")
        };

        const subject     = this._localizationService.getText("emails.admin-invite-user.subject").replace("{0}", config.application.name);
        const mailOptions = {
            from: `${config.application.name} <${config.application.email}>`,
            to: model.ReceiverEmailAddress,
            subject,
            html: template(context)
        };

        this._transporter.sendMail(mailOptions, (error: any, info: any) => {
            if (error) {
                return console.log(error);
            }
        });

    }

    public async sendAdminEnableUserEmail(model: AdminUpdateUserEmailDTO): Promise<void> {

        const enableUserHTML: string = fs.readFileSync(path.join(process.cwd(), "src/views/emails", "AdminEnableUser.html"), "utf8");

        const template = handlebars.compile(enableUserHTML);

        const context = {
            greeting: this._localizationService.getText("emails.admin-enable-user.greeting").replace("{0}", model.ReceiverFullName),
            content: this._localizationService.getText("emails.admin-enable-user.content"),
            senderEmailAddress: model.SenderEmailAddress,
            message: model.Message
        };

        const subject     = this._localizationService.getText("emails.admin-enable-user.subject").replace("{0}", config.application.name);
        const mailOptions = {
            from: `${config.application.name} <${config.application.email}>`,
            to: model.ReceiverEmailAddress,
            subject,
            html: template(context)
        };

        this._transporter.sendMail(mailOptions, (error: any, info: any) => {
            if (error) {
                return console.log(error);
            }
        });

    }

    public async sendAdminDisableUserEmail(model: AdminUpdateUserEmailDTO): Promise<void> {

        const disableUserHTML: string = fs.readFileSync(path.join(process.cwd(), "src/views/emails", "AdminDisableUser.html"), "utf8");

        const template = handlebars.compile(disableUserHTML);

        const context = {
            greeting: this._localizationService.getText("emails.admin-disable-user.greeting").replace("{0}", model.ReceiverFullName),
            content: this._localizationService.getText("emails.admin-disable-user.content"),
            senderEmailAddress: model.SenderEmailAddress,
            message: model.Message
        };

        const subject     = this._localizationService.getText("emails.admin-disable-user.subject").replace("{0}", config.application.name);
        const mailOptions = {
            from: `${config.application.name} <${config.application.email}>`,
            to: model.ReceiverEmailAddress,
            subject,
            html: template(context)
        };

        this._transporter.sendMail(mailOptions, (error: any, info: any) => {
            if (error) {
                return console.log(error);
            }
        });

    }

    public async sendAdminDeleteUserEmail(model: AdminUpdateUserEmailDTO): Promise<void> {

        const deleteUserHTML: string = fs.readFileSync(path.join(process.cwd(), "src/views/emails", "AdminDeleteUser.html"), "utf8");

        const template = handlebars.compile(deleteUserHTML);

        const context = {
            greeting: this._localizationService.getText("emails.admin-delete-user.greeting").replace("{0}", model.ReceiverFullName),
            content: this._localizationService.getText("emails.admin-delete-user.content"),
            senderEmailAddress: model.SenderEmailAddress,
            message: model.Message
        };

        const subject     = this._localizationService.getText("emails.admin-delete-user.subject").replace("{0}", config.application.name);
        const mailOptions = {
            from: `${config.application.name} <${config.application.email}>`,
            to: model.ReceiverEmailAddress,
            subject,
            html: template(context)
        };

        this._transporter.sendMail(mailOptions, (error: any, info: any) => {
            if (error) {
                return console.log(error);
            }
        });

    }

    public async sendResetPasswordEmail(model: ResetPasswordEmailDTO): Promise<void> {

        const resetPasswordHTML: string = fs.readFileSync(path.join(process.cwd(), "src/views/emails", "ResetPassword.html"), "utf8");

        const template = handlebars.compile(resetPasswordHTML);

        const context = {
            greeting: this._localizationService.getText("emails.reset-password.greeting").replace("{0}", model.UserFullName),
            content: this._localizationService.getText("emails.reset-password.content"),
            buttonLink: `${config.client.baseURL}/${config.client.endpoints.resetPasswordResource}/?resetForgottenPasswordID=${model.UserResetForgottenPasswordID}&email=${model.UserEmaiAddress}&lang=${this._localizationService.getLocale()}`,
            buttonText: this._localizationService.getText("emails.reset-password.button")
        };

        const subject     = this._localizationService.getText("emails.reset-password.subject").replace("{0}", config.application.name);
        const mailOptions = {
            from: `${config.application.name} <${config.application.email}>`,
            to: model.UserEmaiAddress,
            subject,
            html: template(context)
        };

        this._transporter.sendMail(mailOptions, (error: any, info: any) => {
            if (error) {
                return console.log(error);
            }
        });
    }

    public setLocale(locale: LocaleType): void {
        this._localizationService.setLocale(locale);
    }

}
