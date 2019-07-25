import { getRepository, Repository }    from "typeorm";
import { injectable }                   from "inversify";
import { Currency }                     from "../models/Currency";
import { ICurrencyRepository }          from "../contracts";

@injectable()
export class CurrencyRepository implements ICurrencyRepository {

    private readonly _currencyRepository: Repository<Currency>;

    constructor() {
        this._currencyRepository = getRepository(Currency);
    }

    public async getAll(): Promise<Currency[]> {
        return await this._currencyRepository.find();
    }

}
