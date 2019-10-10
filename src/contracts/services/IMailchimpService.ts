import { SubcribeToNewsletterDTO }  from "../../dtos";
import { LocaleType }               from "../../enums";

export interface IMailchimpService {

    subscribe (request: SubcribeToNewsletterDTO, locale: LocaleType): Promise<void>;

}
