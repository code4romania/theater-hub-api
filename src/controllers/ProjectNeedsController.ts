import { inject, injectable }       from "inversify";
import { Request, Response }        from "express";
import { TYPES }                    from "../types";
import { ProjectNeed }              from "../models/ProjectNeed";
import { CreateProjectNeedDTO,
    UpdateProjectNeedDTO,
    ProjectNeedDTO }                from "../dtos";
import { IProjectNeedsController,
         IProjectNeedService }      from "../contracts";
import { BaseApiController }        from "./BaseApiController";

@injectable()
export class ProjectNeedsController extends BaseApiController<ProjectNeed> implements IProjectNeedsController {

    private readonly _projectNeedService: IProjectNeedService;

    constructor(@inject(TYPES.ProjectNeedService) projectNeedService: IProjectNeedService) {
        super(projectNeedService);
        this._projectNeedService = projectNeedService;
    }

    public async create(request: Request, response: Response): Promise<void> {
        const createProjectNeedDTO: CreateProjectNeedDTO = request.body as CreateProjectNeedDTO;

        const projectNeed = await this._projectNeedService.createProjectNeed(request.params.projectID, createProjectNeedDTO);

        response.send(new ProjectNeedDTO(projectNeed));
    }

    public async update(request: Request, response: Response): Promise<void> {
        const updateProjectNeedDTO: UpdateProjectNeedDTO = {
            ...request.body,
            ID: request.params.needID,
            ProjectID: request.params.projectID
        } as UpdateProjectNeedDTO;

        this._projectNeedService.setLocale(request.Locale);

        await this._projectNeedService.updateProjectNeed(request.Principal.Email, updateProjectNeedDTO);

        response.sendStatus(200);
    }

    public async deleteByID(request: Request, response: Response): Promise<void> {

        this._projectNeedService.setLocale(request.Locale);

        await this._projectNeedService.deleteProjectNeedByID(request.Principal.Email,
                request.params.projectID,
                request.params.needID);

        response.sendStatus(200);
    }

}
