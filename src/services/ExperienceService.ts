import { inject, injectable }       from "inversify";
import { TYPES }                    from "../types";
import { IExperienceService }       from "./IExperienceService";
import { IUserService }             from "./IUserService";
import { BaseService }              from "./BaseService";
import { Experience }               from "../models/Experience";
import { User }                     from "../models/User";
import { CreateExperienceDTO,
    UpdateExperienceDTO }           from "../dtos";
import { IExperienceRepository }    from "../repositories";

@injectable()
export class ExperienceService extends BaseService<Experience> implements IExperienceService {

    private readonly _experienceRepository: IExperienceRepository;
    private readonly _userService: IUserService;

    constructor(@inject(TYPES.ExperienceRepository) experienceRepository: IExperienceRepository,
                                                @inject(TYPES.UserService) userService: IUserService) {
        super(experienceRepository);
        this._experienceRepository = experienceRepository;
        this._userService          = userService;
    }

    public async createExperienceStep(email: string, createExperienceDTO: CreateExperienceDTO): Promise<Experience> {
        const dbUser: User = await this._userService.getByEmail(email);

        const experienceStep: Experience = {
            Position: createExperienceDTO.Position,
            Employer: createExperienceDTO.Employer,
            Description: createExperienceDTO.Description,
            StartDate: createExperienceDTO.StartDate,
            EndDate: createExperienceDTO.EndDate,
            Professional: dbUser.Professional
        } as Experience;

        return this._experienceRepository.insert(experienceStep);
    }

    public async updateExperienceStep(email: string, updateExperienceDTO: UpdateExperienceDTO): Promise<Experience> {
        const dbUser: User              = await this._userService.getByEmail(email);
        const dbExperience: Experience  = await this._experienceRepository.getByID(updateExperienceDTO.ID);

        if (!dbExperience || !dbUser.Professional.Experience.find(e => e.ID === updateExperienceDTO.ID)) {
            throw new Error("Experience step does not exist!");
        }

        dbExperience.Position       = updateExperienceDTO.Position;
        dbExperience.Employer       = updateExperienceDTO.Employer;
        dbExperience.Description    = updateExperienceDTO.Description;
        dbExperience.StartDate      = updateExperienceDTO.StartDate;
        dbExperience.EndDate        = updateExperienceDTO.EndDate;

        return this._experienceRepository.update(dbExperience);
    }

    public async deleteExperienceStepByID(email: string, experienceID: string): Promise<Experience> {
        const dbUser: User = await this._userService.getByEmail(email);

        if (!dbUser.Professional.Experience.find(e => e.ID === experienceID)) {
            throw new Error("Experience step does not exist!");
        }

        return this._experienceRepository.deleteByID(experienceID);
    }

}
