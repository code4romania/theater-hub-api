import { inject, injectable }  from "inversify";
import { TYPES }               from "../types";
import { IAwardService }       from "./IAwardService";
import { IUserService }        from "./IUserService";
import { BaseService }         from "./BaseService";
import { Award }               from "../models/Award";
import { User }                 from "../models/User";
import { CreateAwardDTO,
    UpdateAwardDTO }            from "../dtos";
import { IAwardRepository }     from "../repositories";

@injectable()
export class AwardService extends BaseService<Award> implements IAwardService {

    private readonly _awardRepository: IAwardRepository;
    private readonly _userService: IUserService;

    constructor(@inject(TYPES.AwardRepository) awardRepository: IAwardRepository,
                                    @inject(TYPES.UserService) userService: IUserService) {
        super(awardRepository);
        this._awardRepository = awardRepository;
        this._userService     = userService;
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

        return this._awardRepository.insert(award);
    }

    public async updateAward(email: string, updateAwardDTO: UpdateAwardDTO): Promise<Award> {
        const dbUser: User = await this._userService.getByEmail(email);
        const dbAward: Award = await this._awardRepository.getByID(updateAwardDTO.ID);

        if (!dbAward || !dbUser.Awards.find(a => a.ID === dbAward.ID)) {
            throw new Error("Award does not exist!");
        }

        dbAward.Title          = updateAwardDTO.Title;
        dbAward.Issuer         = updateAwardDTO.Issuer;
        dbAward.Description    = updateAwardDTO.Description;
        dbAward.Date           = updateAwardDTO.Date;

        return this._awardRepository.update(dbAward);
    }

    public async deleteAwardByID(email: string, awardID: string): Promise<Award> {
        const dbUser: User = await this._userService.getByEmail(email);

        if (!dbUser.Awards.find(a => a.ID === awardID)) {
            throw new Error("Award does not exist!");
        }

        return this._awardRepository.deleteByID(awardID);
    }

}
