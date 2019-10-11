import { injectable }               from "inversify";
import { IMailchimpService }        from "../contracts";
import { SubcribeToNewsletterDTO }  from "../dtos";
import { LocaleType }               from "../enums";

const config    = require("../config/env").getConfig();
const Mailchimp = require("mailchimp-api-v3");

@injectable()
export class MailchimpService implements IMailchimpService {

    private readonly _mailchimp: any;

    constructor (
    ) {
        this._mailchimp             = new Mailchimp(config.mailchimp.api_key);
    }

    public async subscribe(request: SubcribeToNewsletterDTO, locale: LocaleType): Promise<void> {
        await this._mailchimp.post(config.mailchimp.subscribe_url.replace("{0}", config.mailchimp.audience_id), {
                email_address: request.Email,
                status: "pending",
                merge_fields: {
                    "PREFLANG": locale
                }
            });
    }

}
