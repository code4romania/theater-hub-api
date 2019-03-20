import { injectable }           from "inversify";
const fs                        = require("fs");
const path                      = require("path");
import * as _                   from "lodash";
import { ILocalizationService } from "./ILocalizationService";
import { EntityCategoryType,
         LocaleType }           from "../enums";
import { enLocale }             from "../locales/en";
import { roLocale }             from "../locales/ro";

@injectable()
export class LocalizationService implements ILocalizationService {

    private _locale: LocaleType = LocaleType.RO;

    setLocale(locale: LocaleType): void {
        this._locale = locale;
    }

    getLocale(): LocaleType {
        return this._locale;
    }

    getText(identifier: string, locale?: LocaleType): string {

        if (locale) {
            this.setLocale(locale);
        }

        if (this._locale === LocaleType.EN) {
            return this.localize(identifier, enLocale);
        }

        return this.localize(identifier, roLocale);
    }

    localize(identifier: string, source: any): string {

        const localizationPath = identifier.split(".");

        for (const pathElement of localizationPath) {
            source = source[pathElement];
        }

        return source;
    }

}
