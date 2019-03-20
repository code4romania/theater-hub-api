import { inject, injectable }       from "inversify";
import { Request, Response }        from "express";
import chalk                        from "chalk";
import * as uuid                    from "uuid/v4";
import { Application }              from "express";
import { TYPES }                    from "../types";
import { UserVideo }                from "../models/UserVideo";
import { CreateUserVideoDTO,
    UpdateUserVideoDTO,
    UserVideoDTO }                  from "../dtos/user-videos";
import { IUserVideosController }    from "./IUserVideosController";
import { BaseApiController }        from "./BaseApiController";
import { IUserVideoService }        from "../services";

@injectable()
export class UserVideosController extends BaseApiController<UserVideo> implements IUserVideosController {

    private readonly _userVideoService: IUserVideoService;

    constructor(@inject(TYPES.UserVideoService) userVideoService: IUserVideoService) {
        super(userVideoService);
        this._userVideoService = userVideoService;
    }

    public async create(request: Request, response: Response): Promise<void> {
        const createUserVideoDTO: CreateUserVideoDTO = request.body as CreateUserVideoDTO;

        const video = await this._userVideoService.createUserVideo(request.Principal.Email, createUserVideoDTO);

        response.send(new UserVideoDTO(video));
    }

    public async update(request: Request, response: Response): Promise<void> {
        const updateUserVideoDTO: UpdateUserVideoDTO = request.body as UpdateUserVideoDTO;

        this._userVideoService.setLocale(request.Locale);

        const video = await this._userVideoService.updateUserVideo(request.Principal.Email, updateUserVideoDTO);

        response.send(new UserVideoDTO(video));
    }

    public async deleteByID(request: Request, response: Response): Promise<void> {

        this._userVideoService.setLocale(request.Locale);

        const video = await this._userVideoService.deleteUserVideoByID(request.Principal.Email, request.params.videoID);

        response.send(new UserVideoDTO(video));
    }

}
