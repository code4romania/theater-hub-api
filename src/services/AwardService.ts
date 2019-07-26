import { inject, injectable }   from "inversify";
import { TYPES }                from "../types";
import { IAwardService,
    ILocalizationService,
    IUserService,
    IAwardRepository }          from "../contracts";
import { BaseService }          from "./BaseService";
import { Award }                from "../models/Award";
import { User }                 from "../models/User";
import { CreateAwardDTO,
    UpdateAwardDTO }            from "../dtos";

@injectable()
export class AwardService extends BaseService<Award> implements IAwardService {

    private readonly _userService: IUserService;

    constructor(@inject(TYPES.AwardRepository) awardRepository: IAwardRepository,
                        @inject(TYPES.LocalizationService) localizationService: ILocalizationService,
                        @inject(TYPES.UserService) userService: IUserService) {
        super(awardRepository, localizationService);
        this._userService = userService;
    }

    public async createAward(email: string, createAwardDTO: CreateAwardDTO): Promise<Award> {
        const dbUser: User = await this._userService.getByEmail(email);

        const award: Award = {
            Title: createAwardDTO.Title,
            Issuer: createAwardDTO.Issuer,
            Description: createAwardDTO.Description,
            Date: createAwardDTO.Date,
            User: dbUser
        } as Award;

        return this._repository.insert(award);

    }

    public async updateAward(email: string, updateAwardDTO: UpdateAwardDTO): Promise<Award> {
        const dbUser: User = await this._userService.getByEmail(email);
        const dbAward: Award = await this._repository.getByID(updateAwardDTO.ID);

        if (!dbAward || !dbUser.Awards.find(a => a.ID === dbAward.ID)) {
            throw new Error(this._localizationService.getText("validation.award.non-existent"));
        }

        dbAward.Title          = updateAwardDTO.Title;
        dbAward.Issuer         = updateAwardDTO.Issuer;
        dbAward.Description    = updateAwardDTO.Description;
        dbAward.Date           = updateAwardDTO.Date;

        return this._repository.update(dbAward);

    }

    public async deleteAwardByID(email: string, awardID: string): Promise<Award> {
        const dbUser: User = await this._userService.getByEmail(email);

        if (!dbUser.Awards.find(a => a.ID === awardID)) {
            throw new Error(this._localizationService.getText("validation.award.non-existent"));
        }

        return this._repository.deleteByID(awardID);

    }

}
