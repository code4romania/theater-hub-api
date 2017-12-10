import { inject, injectable }  from "inversify";
import { Request, Response }   from "express";
import chalk                   from "chalk";
import * as uuid               from "uuid/v4";
import { Application }         from "express";
import { TYPES }               from "../types";
import { Wish }                from "../models/Wish";
import { IWishesController }   from "./IWishesController";
import { BaseApiController }   from "./BaseApiController";
import { IWishService }        from "../services";
import { Validators }          from "../utils";

@injectable()
export class WishesController extends BaseApiController<Wish> implements IWishesController {

    private readonly _wishService: IWishService;

    constructor(@inject(TYPES.WishService) wishService: IWishService) {
        super(wishService);
        this._wishService = wishService;
    }

}