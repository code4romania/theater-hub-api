import { inject, injectable }  from "inversify";
import { TYPES }               from "../types";
import { IWishService }        from "./IWishService";
import { BaseService }         from "./BaseService";
import { Wish }                from "../models/Wish";
import { IWishRepository }     from "../repositories";

@injectable()
export class WishService extends BaseService<Wish> implements IWishService {

    private readonly _wishRepository: IWishRepository;

    constructor(@inject(TYPES.WishRepository) wishRepository: IWishRepository) {
        super(wishRepository);
        this._wishRepository = wishRepository;
    }

}