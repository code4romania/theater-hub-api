import { LocaleType } from "../enums";

export interface ILocalizationService {

    setLocale(locale: LocaleType): void;

    getLocale(): LocaleType;

    getText(identifier: string, locale?: LocaleType): string;

}
