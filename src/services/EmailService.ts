import { inject, injectable }      from "inversify";
import { TYPES }                   from "../types";
import * as _                      from "lodash";
import { IEmailService,
        ILocalizationService }     from "../contracts";
import {
        AdminInviteManagedUserEmailDTO,
        AdminUpdateEntityEmailDTO,
        AdminUpdateProjectEmailDTO,
        ContactEmailDTO,
        CreateAccountEmailDTO,
        ResetPasswordEmailDTO }    from "../dtos";
import { LocaleType,
    UserRoleType }                 from "../enums";
const config                       = require("../config/env").getConfig();
const AWS                          = require("aws-sdk");
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
            host: config.aws.ses.host,
            port: config.aws.ses.port,
            secure: config.aws.ses.secure,
            auth: {
                user: config.aws.ses.user,
                pass: config.aws.ses.pass
            }
        });

    }

    public async sendCreateAccountEmail(model: CreateAccountEmailDTO): Promise<void> {

        const finishRegistrationHTML: string = fs.readFileSync(path.join(process.cwd(), "src/views/emails/html", "FinishRegistration.html"), "utf8");
        let finishRegistrationText: string = fs.readFileSync(path.join(process.cwd(), "src/views/emails/text", "FinishRegistration.txt"), "utf8");

        const greeting: string = this._localizationService.getText("emails.finish-registration.greeting").replace("{0}", model.UserFullName);
        const buttonLink: string = `${config.client.baseURL}/${config.client.endpoints.createProfileResource}/?registrationID=${model.UserRegistrationID}&email=${model.UserEmailAddress}&lang=${this._localizationService.getLocale()}`;

        finishRegistrationText = finishRegistrationText
                .replace("{{greeting}}", greeting)
                .replace("{{content1}}", this._localizationService.getText("emails.finish-registration.content-1"))
                .replace("{{content2}}", this._localizationService.getText("emails.finish-registration.content-2"))
                .replace("{{applicationName}}", config.application.name)
                .replace("{{applicationLink}}", config.client.baseURL)
                .replace("{{buttonLink}}", buttonLink)
                .replace("{{buttonText}}", this._localizationService.getText("emails.finish-registration.button"));

        const template = handlebars.compile(finishRegistrationHTML);

        const context = {
            greeting: this._localizationService.getText("emails.finish-registration.greeting").replace("{0}", model.UserFullName),
            content1: this._localizationService.getText("emails.finish-registration.content-1"),
            content2: this._localizationService.getText("emails.finish-registration.content-2"),
            applicationName: config.application.name,
            applicationLink: config.client.baseURL,
            buttonLink,
            buttonText: this._localizationService.getText("emails.finish-registration.button")
        };

        const subject     = this._localizationService.getText("emails.finish-registration.subject").replace("{0}", config.application.name);
        const mailOptions = {
            from: `${config.application.name} <${config.application.email}>`,
            to: model.UserEmailAddress,
            subject: subject,
            html: template(context),
            text: finishRegistrationText,
            attachments: [{
                filename: "header_theater_hub.png",
                path: path.join(process.cwd(), "public/images", "header_theater_hub.png"),
                cid: "header-image"
            }]
        };

        this._transporter.sendMail(mailOptions, (error: any, info: any) => {
            if (error) {
                return console.log(error);
            }
        });
    }

    public async sendAdminInviteManagedUserEmail(model: AdminInviteManagedUserEmailDTO): Promise<void> {

        const inviteManagedUserHTML: string = fs.readFileSync(path.join(process.cwd(), "src/views/emails/html", "AdminInviteUser.html"), "utf8");
        let inviteManagedUserText: string = fs.readFileSync(path.join(process.cwd(), "src/views/emails/text", "AdminInviteUser.txt"), "utf8");

        const content2: string = this._localizationService.getText("emails.admin-invite-user.content-2").replace("{0}", (_.invert(UserRoleType))[model.ReceiverRole].toLowerCase());
        const buttonLink: string = `${config.client.baseURL}/${config.client.endpoints.managedUserRegisterResource}/?registrationID=${model.RegistrationID}&email=${model.ReceiverEmailAddress}&lang=${this._localizationService.getLocale()}`;

        inviteManagedUserText = inviteManagedUserText
                    .replace("{{greeting}}", this._localizationService.getText("emails.admin-invite-user.greeting"))
                    .replace("{{content1}}", this._localizationService.getText("emails.admin-invite-user.content-1"))
                    .replace("{{content2}}", content2)
                    .replace("{{applicationName}}", config.application.name)
                    .replace("{{applicationLink}}", config.client.baseURL)
                    .replace("{{senderEmailAddress}}", model.SenderEmailAddress)
                    .replace("{{buttonLink}}", buttonLink)
                    .replace("{{buttonText}}", this._localizationService.getText("emails.admin-invite-user.button"));

        const template = handlebars.compile(inviteManagedUserHTML);

        const context = {
            greeting: this._localizationService.getText("emails.admin-invite-user.greeting"),
            content1: this._localizationService.getText("emails.admin-invite-user.content-1"),
            content2,
            applicationName: config.application.name,
            applicationLink: config.client.baseURL,
            senderEmailAddress: model.SenderEmailAddress,
            buttonLink,
            buttonText: this._localizationService.getText("emails.admin-invite-user.button")
        };

        const subject     = this._localizationService.getText("emails.admin-invite-user.subject").replace("{0}", config.application.name);
        const mailOptions = {
            from: `${config.application.name} <${config.application.email}>`,
            to: model.ReceiverEmailAddress,
            subject,
            html: template(context),
            text: inviteManagedUserText,
            attachments: [{
                filename: "header_theater_hub.png",
                path: path.join(process.cwd(), "public/images", "header_theater_hub.png"),
                cid: "header-image"
            }]
        };

        this._transporter.sendMail(mailOptions, (error: any, info: any) => {
            if (error) {
                return console.log(error);
            }
        });

    }

    public async sendContactEmail(model: ContactEmailDTO): Promise<void> {

        const contactHTML: string = fs.readFileSync(path.join(process.cwd(), "src/views/emails/html", "Contact.html"), "utf8");
        let contactText: string = fs.readFileSync(path.join(process.cwd(), "src/views/emails/text", "Contact.txt"), "utf8");

        const hasAgreedToTerms: string = model.AgreeToTerms ? this._localizationService.getText("emails.contact.yes") :
                                                                        this._localizationService.getText("emails.contact.no");

        contactText = contactText
                .replace("{{fullNameLabel}}", this._localizationService.getText("emails.contact.full-name"))
                .replace("{{emailLabel}}", this._localizationService.getText("emails.contact.email"))
                .replace("{{messageLabel}}", this._localizationService.getText("emails.contact.message"))
                .replace("{{hasAgreedToTermsLabel}}", this._localizationService.getText("emails.contact.has-agreed-to-terms"))
                .replace("{{fullName}}", model.FullName)
                .replace("{{email}}", model.Email)
                .replace("{{message}}", model.Message)
                .replace("{{hasAgreedToTerms}}", hasAgreedToTerms);

        const template = handlebars.compile(contactHTML);

        const context = {
            fullNameLabel: this._localizationService.getText("emails.contact.full-name"),
            emailLabel: this._localizationService.getText("emails.contact.email"),
            messageLabel: this._localizationService.getText("emails.contact.message"),
            hasAgreedToTermsLabel: this._localizationService.getText("emails.contact.has-agreed-to-terms"),
            fullName: model.FullName,
            email: model.Email,
            message: model.Message,
            hasAgreedToTerms
        };

        const subject     = this._localizationService.getText("emails.contact.subject").replace("{0}", model.Subject);
        const mailOptions = {
            from: `${config.application.name} <${config.application.email}>`,
            to: config.application.email,
            subject,
            html: template(context),
            text: contactText,
            attachments: [{
                filename: "header_theater_hub.png",
                path: path.join(process.cwd(), "public/images", "header_theater_hub.png"),
                cid: "header-image"
            }]
        };

        this._transporter.sendMail(mailOptions, (error: any, info: any) => {
            if (error) {
                return console.log(error);
            }
        });

    }

    public async sendAdminEnableUserEmail(model: AdminUpdateEntityEmailDTO): Promise<void> {

        const enableUserHTML: string = fs.readFileSync(path.join(process.cwd(), "src/views/emails/html", "AdminEnableUser.html"), "utf8");
        let enableUserText: string = fs.readFileSync(path.join(process.cwd(), "src/views/emails/text", "AdminEnableUser.txt"), "utf8");

        const greeting: string = this._localizationService.getText("emails.admin-enable-user.greeting").replace("{0}", model.ReceiverFullName);

        enableUserText = enableUserText
                    .replace("{{greeting}}", greeting)
                    .replace("{{content}}", this._localizationService.getText("emails.admin-enable-user.content"))
                    .replace("{{senderEmailAddress}}", model.SenderEmailAddress)
                    .replace("{{message}}", model.Message);

        const template = handlebars.compile(enableUserHTML);

        const context = {
            greeting,
            content: this._localizationService.getText("emails.admin-enable-user.content"),
            senderEmailAddress: model.SenderEmailAddress,
            message: model.Message
        };

        const subject     = this._localizationService.getText("emails.admin-enable-user.subject").replace("{0}", config.application.name);
        const mailOptions = {
            from: `${config.application.name} <${config.application.email}>`,
            to: model.ReceiverEmailAddress,
            subject,
            html: template(context),
            text: enableUserText,
            attachments: [{
                filename: "header_theater_hub.png",
                path: path.join(process.cwd(), "public/images", "header_theater_hub.png"),
                cid: "header-image"
            }]
        };

        this._transporter.sendMail(mailOptions, (error: any, info: any) => {
            if (error) {
                return console.log(error);
            }
        });

    }

    public async sendAdminDisableUserEmail(model: AdminUpdateEntityEmailDTO): Promise<void> {

        const disableUserHTML: string = fs.readFileSync(path.join(process.cwd(), "src/views/emails/html", "AdminDisableUser.html"), "utf8");
        let disableUserText: string = fs.readFileSync(path.join(process.cwd(), "src/views/emails/text", "AdminDisableUser.txt"), "utf8");

        const greeting: string = this._localizationService.getText("emails.admin-disable-user.greeting").replace("{0}", model.ReceiverFullName);

        disableUserText = disableUserText
                        .replace("{{greeting}}", greeting)
                        .replace("{{content}}", this._localizationService.getText("emails.admin-disable-user.content"))
                        .replace("{{senderEmailAddress}}", model.SenderEmailAddress)
                        .replace("{{message}}", model.Message);

        const template = handlebars.compile(disableUserHTML);

        const context = {
            greeting,
            content: this._localizationService.getText("emails.admin-disable-user.content"),
            senderEmailAddress: model.SenderEmailAddress,
            message: model.Message
        };

        const subject     = this._localizationService.getText("emails.admin-disable-user.subject").replace("{0}", config.application.name);
        const mailOptions = {
            from: `${config.application.name} <${config.application.email}>`,
            to: model.ReceiverEmailAddress,
            subject,
            html: template(context),
            text: disableUserText,
            attachments: [{
                filename: "header_theater_hub.png",
                path: path.join(process.cwd(), "public/images", "header_theater_hub.png"),
                cid: "header-image"
            }]
        };

        this._transporter.sendMail(mailOptions, (error: any, info: any) => {
            if (error) {
                return console.log(error);
            }
        });

    }

    public async sendAdminDeleteUserEmail(model: AdminUpdateEntityEmailDTO): Promise<void> {

        const deleteUserHTML: string = fs.readFileSync(path.join(process.cwd(), "src/views/emails/html", "AdminDeleteUser.html"), "utf8");
        let deleteUserText: string = fs.readFileSync(path.join(process.cwd(), "src/views/emails/text", "AdminDeleteUser.txt"), "utf8");

        const greeting: string = this._localizationService.getText("emails.admin-delete-user.greeting").replace("{0}", model.ReceiverFullName);

        deleteUserText = deleteUserText
                    .replace("{{greeting}}", greeting)
                    .replace("{{content}}", this._localizationService.getText("emails.admin-delete-user.content"))
                    .replace("{{senderEmailAddress}}", model.SenderEmailAddress)
                    .replace("{{message}}", model.Message);

        const template = handlebars.compile(deleteUserHTML);

        const context = {
            greeting,
            content: this._localizationService.getText("emails.admin-delete-user.content"),
            senderEmailAddress: model.SenderEmailAddress,
            message: model.Message
        };

        const subject     = this._localizationService.getText("emails.admin-delete-user.subject").replace("{0}", config.application.name);
        const mailOptions = {
            from: `${config.application.name} <${config.application.email}>`,
            to: model.ReceiverEmailAddress,
            subject,
            html: template(context),
            text: deleteUserText,
            attachments: [{
                filename: "header_theater_hub.png",
                path: path.join(process.cwd(), "public/images", "header_theater_hub.png"),
                cid: "header-image"
            }]
        };

        this._transporter.sendMail(mailOptions, (error: any, info: any) => {
            if (error) {
                return console.log(error);
            }
        });

    }

    public async sendAdminEnableProjectEmail(model: AdminUpdateProjectEmailDTO): Promise<void> {

        const enableProjectHTML: string = fs.readFileSync(path.join(process.cwd(), "src/views/emails/html", "AdminEnableProject.html"), "utf8");
        let enableProjectText: string   = fs.readFileSync(path.join(process.cwd(), "src/views/emails/text", "AdminEnableProject.txt"), "utf8");

        const greeting: string  = this._localizationService.getText("emails.admin-enable-project.greeting").replace("{0}", model.ReceiverFullName);
        const content: string   = this._localizationService.getText("emails.admin-enable-project.content").replace("{0}", model.ProjectName);

        enableProjectText = enableProjectText
                    .replace("{{greeting}}", greeting)
                    .replace("{{content}}", content)
                    .replace("{{senderEmailAddress}}", model.SenderEmailAddress)
                    .replace("{{message}}", model.Message);

        const template = handlebars.compile(enableProjectHTML);

        const context = {
            greeting,
            content,
            senderEmailAddress: model.SenderEmailAddress,
            message: model.Message
        };

        const subject     = this._localizationService.getText("emails.admin-enable-project.subject").replace("{0}", config.application.name);
        const mailOptions = {
            from: `${config.application.name} <${config.application.email}>`,
            to: model.ReceiverEmailAddress,
            subject,
            html: template(context),
            text: enableProjectText,
            attachments: [{
                filename: "header_theater_hub.png",
                path: path.join(process.cwd(), "public/images", "header_theater_hub.png"),
                cid: "header-image"
            }]
        };

        this._transporter.sendMail(mailOptions, (error: any, info: any) => {
            if (error) {
                return console.log(error);
            }
        });

    }

    public async sendAdminDisableProjectEmail(model: AdminUpdateProjectEmailDTO): Promise<void> {

        const disableProjectHTML: string    = fs.readFileSync(path.join(process.cwd(), "src/views/emails/html", "AdminDisableProject.html"), "utf8");
        let disableProjectText: string      = fs.readFileSync(path.join(process.cwd(), "src/views/emails/text", "AdminDisableProject.txt"), "utf8");

        const greeting: string  = this._localizationService.getText("emails.admin-disable-project.greeting").replace("{0}", model.ReceiverFullName);
        const content: string   = this._localizationService.getText("emails.admin-disable-project.content").replace("{0}", model.ProjectName);

        disableProjectText = disableProjectText
                        .replace("{{greeting}}", greeting)
                        .replace("{{content}}", content)
                        .replace("{{senderEmailAddress}}", model.SenderEmailAddress)
                        .replace("{{message}}", model.Message);

        const template = handlebars.compile(disableProjectHTML);

        const context = {
            greeting,
            content,
            senderEmailAddress: model.SenderEmailAddress,
            message: model.Message
        };

        const subject     = this._localizationService.getText("emails.admin-disable-project.subject").replace("{0}", config.application.name);
        const mailOptions = {
            from: `${config.application.name} <${config.application.email}>`,
            to: model.ReceiverEmailAddress,
            subject,
            html: template(context),
            text: disableProjectText,
            attachments: [{
                filename: "header_theater_hub.png",
                path: path.join(process.cwd(), "public/images", "header_theater_hub.png"),
                cid: "header-image"
            }]
        };

        this._transporter.sendMail(mailOptions, (error: any, info: any) => {
            if (error) {
                return console.log(error);
            }
        });

    }

    public async sendAdminDeleteProjectEmail(model: AdminUpdateProjectEmailDTO): Promise<void> {

        const deleteProjectHTML: string    = fs.readFileSync(path.join(process.cwd(), "src/views/emails/html", "AdminDeleteProject.html"), "utf8");
        let deleteProjectText: string      = fs.readFileSync(path.join(process.cwd(), "src/views/emails/text", "AdminDeleteProject.txt"), "utf8");

        const greeting: string  = this._localizationService.getText("emails.admin-delete-project.greeting").replace("{0}", model.ReceiverFullName);
        const content: string   = this._localizationService.getText("emails.admin-delete-project.content").replace("{0}", model.ProjectName);

        deleteProjectText = deleteProjectText
                    .replace("{{greeting}}", greeting)
                    .replace("{{content}}", content)
                    .replace("{{senderEmailAddress}}", model.SenderEmailAddress)
                    .replace("{{message}}", model.Message);

        const template = handlebars.compile(deleteProjectHTML);

        const context = {
            greeting,
            content,
            senderEmailAddress: model.SenderEmailAddress,
            message: model.Message
        };

        const subject     = this._localizationService.getText("emails.admin-delete-project.subject").replace("{0}", config.application.name);
        const mailOptions = {
            from: `${config.application.name} <${config.application.email}>`,
            to: model.ReceiverEmailAddress,
            subject,
            html: template(context),
            text: deleteProjectText,
            attachments: [{
                filename: "header_theater_hub.png",
                path: path.join(process.cwd(), "public/images", "header_theater_hub.png"),
                cid: "header-image"
            }]
        };

        this._transporter.sendMail(mailOptions, (error: any, info: any) => {
            if (error) {
                return console.log(error);
            }
        });

    }

    public async sendResetPasswordEmail(model: ResetPasswordEmailDTO): Promise<void> {

        const resetPasswordHTML: string = fs.readFileSync(path.join(process.cwd(), "src/views/emails/html", "ResetPassword.html"), "utf8");
        let resetPasswordText: string = fs.readFileSync(path.join(process.cwd(), "src/views/emails/text", "ResetPassword.txt"), "utf8");

        const greeting: string = this._localizationService.getText("emails.reset-password.greeting").replace("{0}", model.UserFullName);
        const buttonLink: string = `${config.client.baseURL}/${config.client.endpoints.resetPasswordResource}/?resetForgottenPasswordID=${model.UserResetForgottenPasswordID}&email=${model.UserEmaiAddress}&lang=${this._localizationService.getLocale()}`;

        resetPasswordText = resetPasswordText
                            .replace("{{greeting}}", greeting)
                            .replace("{{content}}", this._localizationService.getText("emails.reset-password.content"))
                            .replace("{{buttonText}}", this._localizationService.getText("emails.reset-password.button"))
                            .replace("{{buttonLink}}", buttonLink);

        const template = handlebars.compile(resetPasswordHTML);

        const context = {
            greeting,
            content: this._localizationService.getText("emails.reset-password.content"),
            buttonLink: buttonLink,
            buttonText: this._localizationService.getText("emails.reset-password.button")
        };

        const subject     = this._localizationService.getText("emails.reset-password.subject").replace("{0}", config.application.name);
        const mailOptions = {
            from: `${config.application.name} <${config.application.email}>`,
            to: model.UserEmaiAddress,
            subject,
            html: template(context),
            text: resetPasswordText,
            attachments: [{
                filename: "header_theater_hub.png",
                path: path.join(process.cwd(), "public/images", "header_theater_hub.png"),
                cid: "header-image"
            }]
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
