import { inject, injectable }      from "inversify";
import { TYPES }                   from "../types";
import { IApplicationDataService,
                   ISkillService } from ".";
import { Skill }                   from "../models";


@injectable()
export class ApplicationDataService implements IApplicationDataService {

    private readonly _skillService: ISkillService;

    constructor(@inject(TYPES.SkillService) skillService: ISkillService) {

        this._skillService = skillService;
    }

    public async getSkills(): Promise<Skill[]> {

        const skills: Skill[] = await this._skillService.getAll();

        return skills;
    }

}
