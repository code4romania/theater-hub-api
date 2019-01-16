import { inject, injectable }   from "inversify";
import { TYPES }                from "../types";
import { IUserVideoService }    from "./IUserVideoService";
import { IUserService }         from "./IUserService";
import { BaseService }          from "./BaseService";
import { UserVideo }            from "../models/UserVideo";
import { User }                 from "../models/User";
import { CreateUserVideoDTO,
    UpdateUserVideoDTO }        from "../dtos";
import { IUserVideoRepository } from "../repositories";

@injectable()
export class UserVideoService extends BaseService<UserVideo> implements IUserVideoService {

    private readonly _userVideoRepository: IUserVideoRepository;
    private readonly _userService: IUserService;

    constructor(@inject(TYPES.UserVideoRepository) userVideoRepository: IUserVideoRepository,
                                                @inject(TYPES.UserService) userService: IUserService) {
        super(userVideoRepository);
        this._userVideoRepository = userVideoRepository;
        this._userService         = userService;
    }

    public async createUserVideo(email: string, createUserVideoDTO: CreateUserVideoDTO): Promise<UserVideo> {
        const dbUser: User = await this._userService.getByEmail(email);

        const userVideo: UserVideo = {
            Video: createUserVideoDTO.Video,
            User: dbUser
        } as UserVideo;

        return this._userVideoRepository.insert(userVideo);
    }

    public async updateUserVideo(email: string, updateUserVideoDTO: UpdateUserVideoDTO): Promise<UserVideo> {
        const dbUser: User            = await this._userService.getByEmail(email);
        const dbUserVideo: UserVideo  = await this._userVideoRepository.getByID(updateUserVideoDTO.ID);

        if (!dbUserVideo || !dbUser.VideoGallery.find(v => v.ID === dbUserVideo.ID)) {
            throw new Error("Video does not exist!");
        }

        dbUserVideo.Video = updateUserVideoDTO.Video;

        return this._userVideoRepository.update(dbUserVideo);
    }

    public async deleteUserVideoByID(email: string, videoID: string): Promise<UserVideo> {
        const dbUser: User = await this._userService.getByEmail(email);

        if (!dbUser.VideoGallery.find(v => v.ID === videoID)) {
            throw new Error("Video does not exist!");
        }

        return this._userVideoRepository.deleteByID(videoID);
    }

}
