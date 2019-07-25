import { inject, injectable }       from "inversify";
import { TYPES }                    from "../types";
import { IExperienceService,
        ILocalizationService,
        IExperienceRepository,
        IUserService }              from "../contracts";
import { BaseService }              from "./BaseService";
import { Experience }               from "../models/Experience";
import { User }                     from "../models/User";
import { CreateExperienceDTO,
    UpdateExperienceDTO }           from "../dtos";

@injectable()
export class ExperienceService extends BaseService<Experience> implements IExperienceService {

    private readonly _userService: IUserService;

    constructor(@inject(TYPES.ExperienceRepository) experienceRepository: IExperienceRepository,
                                    @inject(TYPES.LocalizationService) localizationService: ILocalizationService,
                                    @inject(TYPES.UserService) userService: IUserService) {
        super(experienceRepository, localizationService);
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

        const response = await this._repository.insert(experienceStep);

        this._userService.publishUpdatedResume(email, dbUser.AccountSettings.Locale);

        return response;
    }

    public async updateExperienceStep(email: string, updateExperienceDTO: UpdateExperienceDTO): Promise<Experience> {
        const dbUser: User              = await this._userService.getByEmail(email);
        const dbExperience: Experience  = await this._repository.getByID(updateExperienceDTO.ID);

        if (!dbExperience || !dbUser.Professional.Experience.find(e => e.ID === updateExperienceDTO.ID)) {
            throw new Error(this._localizationService.getText("validation.experience.non-existent"));
        }

        dbExperience.Position       = updateExperienceDTO.Position;
        dbExperience.Employer       = updateExperienceDTO.Employer;
        dbExperience.Description    = updateExperienceDTO.Description;
        dbExperience.StartDate      = updateExperienceDTO.StartDate;
        dbExperience.EndDate        = updateExperienceDTO.EndDate;

        const response = await this._repository.update(dbExperience);

        this._userService.publishUpdatedResume(email, dbUser.AccountSettings.Locale);

        return response;
    }

    public async deleteExperienceStepByID(email: string, experienceID: string): Promise<Experience> {
        const dbUser: User = await this._userService.getByEmail(email);

        if (!dbUser.Professional.Experience.find(e => e.ID === experienceID)) {
            throw new Error(this._localizationService.getText("validation.experience.non-existent"));
        }

        const response = await this._repository.deleteByID(experienceID);

        this._userService.publishUpdatedResume(email, dbUser.AccountSettings.Locale);

        return response;
    }

}
