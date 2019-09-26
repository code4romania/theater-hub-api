import { inject, injectable }       from "inversify";
import { Request, Response }        from "express";
import { TYPES }                    from "../types";
import { ProjectUpdate }            from "../models/ProjectUpdate";
import { CreateProjectUpdateDTO,
    UpdateProjectUpdateDTO,
    ProjectUpdateDTO }              from "../dtos";
import { IProjectUpdatesController,
         IProjectUpdateService }    from "../contracts";
import { BaseApiController }        from "./BaseApiController";

@injectable()
export class ProjectUpdatesController extends BaseApiController<ProjectUpdate> implements IProjectUpdatesController {

    private readonly _projectUpdateService: IProjectUpdateService;

    constructor(@inject(TYPES.ProjectUpdateService) projectUpdateService: IProjectUpdateService) {
        super(projectUpdateService);
        this._projectUpdateService = projectUpdateService;
    }

    public async create(request: Request, response: Response): Promise<void> {
        const createProjectUpdateDTO: CreateProjectUpdateDTO = request.body as CreateProjectUpdateDTO;

        const projectUpdate = await this._projectUpdateService.createProjectUpdate(request.params.projectID, createProjectUpdateDTO);

        response.send(new ProjectUpdateDTO(projectUpdate));
    }

    public async update(request: Request, response: Response): Promise<void> {
        const updateProjectUpdateDTO: UpdateProjectUpdateDTO = {
            ...request.body,
            ID: request.params.updateID,
            ProjectID: request.params.projectID
        } as UpdateProjectUpdateDTO;

        this._projectUpdateService.setLocale(request.Locale);

        const projectUpdate = await this._projectUpdateService.updateProjectUpdate(request.Principal.Email, updateProjectUpdateDTO);

        response.send(new ProjectUpdateDTO(projectUpdate));
    }

    public async deleteByID(request: Request, response: Response): Promise<void> {

        this._projectUpdateService.setLocale(request.Locale);

        await this._projectUpdateService.deleteProjectUpdateByID(request.Principal.Email,
                    request.params.projectID,
                    request.params.updateID);

        response.sendStatus(200);
    }

}
