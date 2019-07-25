import { Locale } from "../../models/Locale";

export interface ILocaleRepository {

    getAll(): Promise<Locale[]>;

}
