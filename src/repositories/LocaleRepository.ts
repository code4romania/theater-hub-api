import { getRepository, Repository }    from "typeorm";
import { injectable }                   from "inversify";
import { Locale }                       from "../models/Locale";
import { ILocaleRepository }            from "./ILocaleRepository";

@injectable()
export class LocaleRepository implements ILocaleRepository {

    private readonly _localeRepository: Repository<Locale>;

    constructor() {
        this._localeRepository = getRepository(Locale);
    }

    public async getAll(): Promise<Locale[]> {
        return await this._localeRepository.find();
    }

}
