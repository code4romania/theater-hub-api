import { inject, injectable }   from "inversify";
import { TYPES }                from "../types";
import { ILocalizationService } from "./ILocalizationService";
import { IWishService }         from "./IWishService";
import { BaseService }          from "./BaseService";
import { Wish }                 from "../models/Wish";
import { IWishRepository }      from "../repositories";

@injectable()
export class WishService extends BaseService<Wish> implements IWishService {

    constructor(@inject(TYPES.WishRepository) wishRepository: IWishRepository,
                @inject(TYPES.LocalizationService) localizationService: ILocalizationService) {
        super(wishRepository, localizationService);
    }

}
