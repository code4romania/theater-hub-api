import { getRepository, Repository }       from "typeorm";
import { injectable }                      from "inversify";
import { Wish }                            from "../models/Wish";
import { BaseRepository }                  from "./BaseRepository";
import { IWishRepository }                 from "./IWishRepository";

@injectable()
export class WishRepository extends BaseRepository<Wish> implements IWishRepository {

    private readonly _wishRepository: Repository<Wish>;

    constructor() {
        super(getRepository(Wish));
        this._wishRepository = getRepository(Wish);
    }

}