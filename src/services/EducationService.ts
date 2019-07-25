import { inject, injectable }   from "inversify";
import { TYPES }                from "../types";
import { IEducationService,
    ILocalizationService,
    IEducationRepository,
    IUserService }              from "../contracts";
import { BaseService }          from "./BaseService";
import { Education }            from "../models/Education";
import { User }                 from "../models/User";
import { CreateEducationDTO,
    UpdateEducationDTO }        from "../dtos";

@injectable()
export class EducationService extends BaseService<Education> implements IEducationService {

    private readonly _userService: IUserService;

    constructor(@inject(TYPES.EducationRepository) educationRepository: IEducationRepository,
                            @inject(TYPES.LocalizationService) localizationService: ILocalizationService,
                            @inject(TYPES.UserService) userService: IUserService) {
        super(educationRepository, localizationService);
        this._userService = userService;
    }

    public async createEducationStep(email: string, createEducationDTO: CreateEducationDTO): Promise<Education> {
        const dbUser: User = await this._userService.getByEmail(email);

        const education: Education = {
            Title: createEducationDTO.Title,
            Institution: createEducationDTO.Institution,
            Description: createEducationDTO.Description,
            StartDate: createEducationDTO.StartDate,
            EndDate: createEducationDTO.EndDate,
            Professional: dbUser.Professional
        } as Education;

        const response = await this._repository.insert(education);

        this._userService.publishUpdatedResume(email, dbUser.AccountSettings.Locale);

        return response;
    }

    public async updateEducationStep(email: string, updateEducationDTO: UpdateEducationDTO): Promise<Education> {
        const dbUser: User           = await this._userService.getByEmail(email);
        const dbEducation: Education = await this._repository.getByID(updateEducationDTO.ID);

        if (!dbEducation || !dbUser.Professional.Education.find(e => e.ID === updateEducationDTO.ID)) {
            throw new Error(this._localizationService.getText("validation.education.non-existent"));
        }

        dbEducation.Title         = updateEducationDTO.Title;
        dbEducation.Institution   = updateEducationDTO.Institution;
        dbEducation.Description   = updateEducationDTO.Description;
        dbEducation.StartDate     = updateEducationDTO.StartDate;
        dbEducation.EndDate       = updateEducationDTO.EndDate;

        const response = await this._repository.update(dbEducation);

        this._userService.publishUpdatedResume(email, dbUser.AccountSettings.Locale);

        return response;
    }

    public async deleteEducationStepByID(email: string, educationID: string): Promise<Education> {
        const dbUser: User = await this._userService.getByEmail(email);

        if (!dbUser.Professional.Education.find(e => e.ID === educationID)) {
            throw new Error(this._localizationService.getText("validation.education.non-existent"));
        }

        const response = await this._repository.deleteByID(educationID);

        this._userService.publishUpdatedResume(email, dbUser.AccountSettings.Locale);

        return response;
    }

}
