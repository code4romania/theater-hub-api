import { inject, injectable }         from "inversify";
import { Request, Response }          from "express";
import { TYPES }                      from "../types";
import { IAdministrationController,
        IAdministrationService }      from "../contracts";
import { UserSortCriterion, ProjectSortCriterion }          from "../enums";
import { User }                       from "../models";
import { GetEntitiesRequestDTO,
    GetEntitiesResponseDTO,
    ManagedUserDTO,
    UpdateEntityStatusDTO,
    DashboardUser, DashboardProject}  from "../dtos";

@injectable()
export class AdministrationController implements IAdministrationController {

    private readonly _administrationService: IAdministrationService;

    constructor(@inject(TYPES.AdministrationService) administrationService: IAdministrationService) {
        this._administrationService = administrationService;
    }

    public async getUsers(request: Request, response: Response): Promise<void> {
        const searchTerm: string        = request.query.searchTerm;
        const sortCriterion: number     = +request.query.sortCriterion;
        const sortOrientation: string   = request.query.sortOrientation;
        const page: number              = request.query.page;
        const pageSize: number          = request.query.pageSize;

        this._administrationService.setLocale(request.Locale);

        const getUsersRequest: GetEntitiesRequestDTO =
            new GetEntitiesRequestDTO(request.Principal.Email, searchTerm, sortOrientation, sortCriterion, page, pageSize);

        const getUsersResponse: GetEntitiesResponseDTO<DashboardUser>
                    = await this._administrationService.getUsers(getUsersRequest);

        response.send(getUsersResponse);
    }

    public async inviteUser(request: Request, response: Response): Promise<void> {
        const user: ManagedUserDTO = request.body as ManagedUserDTO;

        this._administrationService.setLocale(request.Locale);

        const invitedUser: User = await this._administrationService.inviteUser(request.Principal.Email, user);

        response.send(invitedUser);
    }

    public async enableUser(request: Request, response: Response): Promise<void> {
        const updateUserAccountStatusDTO: UpdateEntityStatusDTO = request.body as UpdateEntityStatusDTO;

        this._administrationService.setLocale(request.Locale);

        await this._administrationService.enableUser(request.Principal.Email, request.params.userID, updateUserAccountStatusDTO);

        response.sendStatus(200);
    }

    public async disableUser(request: Request, response: Response): Promise<void> {
        const updateUserAccountStatusDTO: UpdateEntityStatusDTO = request.body as UpdateEntityStatusDTO;

        this._administrationService.setLocale(request.Locale);

        await this._administrationService.disableUser(request.Principal.Email, request.params.userID, updateUserAccountStatusDTO);

        response.sendStatus(200);
    }

    public async deleteUser(request: Request, response: Response): Promise<void> {
        const updateUserAccountStatusDTO: UpdateEntityStatusDTO = request.body as UpdateEntityStatusDTO;

        this._administrationService.setLocale(request.Locale);

        await this._administrationService.deleteUser(request.Principal.Email, request.params.userID, updateUserAccountStatusDTO);

        response.sendStatus(200);
    }

    public async getProjects (request: Request, response: Response): Promise<void> {
        const searchTerm: string        = request.query.searchTerm;
        const sortCriterion: number     = +request.query.sortCriterion;
        const sortOrientation: string   = request.query.sortOrientation;
        const page: number              = +request.query.page;
        const pageSize: number          = +request.query.pageSize;

        this._administrationService.setLocale(request.Locale);

        const getProjectsRequest: GetEntitiesRequestDTO =
            new GetEntitiesRequestDTO(request.Principal.Email, searchTerm, sortOrientation, sortCriterion, page, pageSize);

        const getProjectsResponse: GetEntitiesResponseDTO<DashboardProject>
                    = await this._administrationService.getProjects(getProjectsRequest);

        response.send(getProjectsResponse);
    }

    public async enableProject (request: Request, response: Response): Promise<void> {
        const updateProjectStatusDTO: UpdateEntityStatusDTO = request.body as UpdateEntityStatusDTO;

        this._administrationService.setLocale(request.Locale);

        await this._administrationService.enableProject(request.Principal.Email, request.params.projectID, updateProjectStatusDTO);

        response.sendStatus(200);
    }

    public async disableProject (request: Request, response: Response): Promise<void> {
        const updateProjectStatusDTO: UpdateEntityStatusDTO = request.body as UpdateEntityStatusDTO;

        this._administrationService.setLocale(request.Locale);

        await this._administrationService.disableProject(request.Principal.Email, request.params.projectID, updateProjectStatusDTO);

        response.sendStatus(200);
    }

    public async deleteProject (request: Request, response: Response): Promise<void> {
        const updateProjectStatusDTO: UpdateEntityStatusDTO = request.body as UpdateEntityStatusDTO;

        this._administrationService.setLocale(request.Locale);

        await this._administrationService.deleteProject(request.Principal.Email, request.params.projectID, updateProjectStatusDTO);

        response.sendStatus(200);
    }

}
