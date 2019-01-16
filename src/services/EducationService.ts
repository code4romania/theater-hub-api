import { inject, injectable }   from "inversify";
import { TYPES }                from "../types";
import { IEducationService }    from "./IEducationService";
import { IUserService }         from "./IUserService";
import { BaseService }          from "./BaseService";
import { Education }            from "../models/Education";
import { User }                 from "../models/User";
import { CreateEducationDTO,
    UpdateEducationDTO }        from "../dtos";
import { IEducationRepository } from "../repositories";

@injectable()
export class EducationService extends BaseService<Education> implements IEducationService {

    private readonly _educationRepository: IEducationRepository;
    private readonly _userService: IUserService;

    constructor(@inject(TYPES.EducationRepository) educationRepository: IEducationRepository,
                                                @inject(TYPES.UserService) userService: IUserService) {
        super(educationRepository);
        this._educationRepository = educationRepository;
        this._userService         = userService;
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

        return this._educationRepository.insert(education);
    }

    public async updateEducationStep(email: string, updateEducationDTO: UpdateEducationDTO): Promise<Education> {
        const dbUser: User           = await this._userService.getByEmail(email);
        const dbEducation: Education = await this._educationRepository.getByID(updateEducationDTO.ID);

        if (!dbEducation || !dbUser.Professional.Education.find(e => e.ID === updateEducationDTO.ID)) {
            throw new Error("Education step does not exist!");
        }

        dbEducation.Title         = updateEducationDTO.Title;
        dbEducation.Institution   = updateEducationDTO.Institution;
        dbEducation.Description   = updateEducationDTO.Description;
        dbEducation.StartDate     = updateEducationDTO.StartDate;
        dbEducation.EndDate       = updateEducationDTO.EndDate;

        return this._educationRepository.update(dbEducation);
    }

    public async deleteEducationStepByID(email: string, educationID: string): Promise<Education> {
        const dbUser: User = await this._userService.getByEmail(email);

        if (!dbUser.Professional.Education.find(e => e.ID === educationID)) {
            throw new Error("Education step does not exist!");
        }

        return this._educationRepository.deleteByID(educationID);
    }

}
