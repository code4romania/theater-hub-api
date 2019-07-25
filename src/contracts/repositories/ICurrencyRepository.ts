import { Currency } from "../../models/Currency";

export interface ICurrencyRepository {

    getAll(): Promise<Currency[]>;

}
