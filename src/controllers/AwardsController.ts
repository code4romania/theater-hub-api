import { inject, injectable }       from "inversify";
import { Request, Response }        from "express";
import { TYPES }                    from "../types";
import { Award }                    from "../models/Award";
import { CreateAwardDTO,
    UpdateAwardDTO, AwardDTO }      from "../dtos/awards";
import { IAwardsController,
         IAwardService }            from "../contracts";
import { BaseApiController }        from "./BaseApiController";

@injectable()
export class AwardsController extends BaseApiController<Award> implements IAwardsController {

    private readonly _awardService: IAwardService;

    constructor(@inject(TYPES.AwardService) awardService: IAwardService) {
        super(awardService);
        this._awardService = awardService;
    }

    public async create(request: Request, response: Response): Promise<void> {
        const createAwardDTO: CreateAwardDTO = request.body as CreateAwardDTO;

        const award = await this._awardService.createAward(request.Principal.Email, createAwardDTO);

        response.send(new AwardDTO(award));
    }

    public async update(request: Request, response: Response): Promise<void> {
        const updateAwardDTO: UpdateAwardDTO = request.body as UpdateAwardDTO;

        this._awardService.setLocale(request.Locale);

        const award = await this._awardService.updateAward(request.Principal.Email, updateAwardDTO);

        response.send(new AwardDTO(award));
    }

    public async deleteByID(request: Request, response: Response): Promise<void> {

        this._awardService.setLocale(request.Locale);

        const award = await this._awardService.deleteAwardByID(request.Principal.Email, request.params.awardID);

        response.send(new AwardDTO(award));
    }

}
