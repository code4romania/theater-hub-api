import { inject, injectable }               from "inversify";
import * as _                               from "lodash";
import { TYPES }                            from "../types";
import {
    IProjectNeedService,
    ILocalizationService,
    IProjectService,
    IUserService,
    IProjectNeedRepository,
    IProjectNeedTagCategoryRepository,
    IProjectNeedTagRepository}              from "../contracts";
import { BaseService }                      from "./BaseService";
import { Project,
        ProjectNeed,
        ProjectNeedTagCategory,
        User,
        ProjectNeedTag }                    from "../models";
import { CreateProjectNeedDTO,
    UpdateProjectNeedDTO }                  from "../dtos";

@injectable()
export class ProjectNeedService extends BaseService<ProjectNeed> implements IProjectNeedService {

    private readonly _projectNeedTagCategoryRepository: IProjectNeedTagCategoryRepository;
    private readonly _projectNeedTagRepository: IProjectNeedTagRepository;
    private readonly _projectService: IProjectService;
    private readonly _userService: IUserService;

    constructor(@inject(TYPES.ProjectNeedRepository) projectNeedRepository: IProjectNeedRepository,
                    @inject(TYPES.ProjectNeedTagCategoryRepository) projectNeedTagCategoryRepository: IProjectNeedTagCategoryRepository,
                    @inject(TYPES.ProjectNeedTagRepository) projectNeedTagRepository: IProjectNeedTagRepository,
                    @inject(TYPES.LocalizationService) localizationService: ILocalizationService,
                    @inject(TYPES.ProjectService) projectService: IProjectService,
                    @inject(TYPES.UserService) userService: IUserService) {
        super(projectNeedRepository, localizationService);
        this._projectNeedTagCategoryRepository  = projectNeedTagCategoryRepository;
        this._projectNeedTagRepository          = projectNeedTagRepository;
        this._projectService                    = projectService;
        this._userService                       = userService;
    }

    public async createProjectNeed(projectID: string, createProjectNeedDTO: CreateProjectNeedDTO): Promise<ProjectNeed> {
        const dbProject: Project = await this._projectService.getByID(projectID);

        const projectNeed: ProjectNeed = {
            Description: createProjectNeedDTO.Description,
            Project: dbProject,
            Tags: []
        } as ProjectNeed;

        if (createProjectNeedDTO.Tags && createProjectNeedDTO.Tags.length !== 0) {

            const tags: ProjectNeedTagCategory[] =
                                await this._projectNeedTagCategoryRepository.getByIDs(createProjectNeedDTO.Tags);

            tags.forEach(t => {
                const projectNeedTag: ProjectNeedTag = {
                    ProjectNeed: projectNeed,
                    ProjectNeedTagCategory: t
                } as ProjectNeedTag;

                projectNeed.Tags.push(projectNeedTag);
            });
        }

        const response = await this._repository.insert(projectNeed);

        return response;

    }

    public async updateProjectNeed(email: string, updateProjectNeedDTO: UpdateProjectNeedDTO): Promise<void> {
        const dbUser: User                  = await this._userService.getByEmail(email);
        const dbProject: Project            = dbUser.Projects.find(p => p.ID === updateProjectNeedDTO.ProjectID);
        const dbProjectNeed: ProjectNeed    = dbProject.Needs.find(n => n.ID === updateProjectNeedDTO.ID);
        dbProjectNeed.Tags = [];

        if (!dbProjectNeed) {
            throw new Error(this._localizationService.getText("validation.project.need.non-existent"));
        }

        const tags: ProjectNeedTagCategory[]    = await this._projectNeedTagCategoryRepository.getAll();
        const dbIDs: string[]                   = dbProjectNeed.Tags.map(t => t.ProjectNeedTagCategoryID);
        const addedIDs: string[]                = updateProjectNeedDTO.Tags.filter(t => dbIDs.indexOf(t) === -1);
        const removedIDs: string[]              = dbIDs.filter(id => updateProjectNeedDTO.Tags.indexOf(id) === -1);

        addedIDs.forEach(async id => {
            const projectNeedTag: ProjectNeedTag = {
                ProjectNeed: dbProjectNeed,
                ProjectNeedTagCategory: tags.find(t => t.ID === id)
            } as ProjectNeedTag;

            this._projectNeedTagRepository.insert(projectNeedTag);
        });

        removedIDs.forEach(async id => {
            this._projectNeedTagRepository.delete(dbProjectNeed.Tags.find(t => t.ProjectNeedTagCategoryID === id));
        });

        this._repository
                .runCreateQueryBuilder()
                .update(ProjectNeed)
                .set({
                    Description: updateProjectNeedDTO.Description
                })
                .where("ID = :id", { id: updateProjectNeedDTO.ID })
                .execute();

    }

    public async deleteProjectNeedByID(email: string, projectID: string, projectNeedID: string): Promise<ProjectNeed> {
        const dbUser: User                  = await this._userService.getByEmail(email);
        const dbProject: Project            = dbUser.Projects.find(p => p.ID === projectID);
        const dbProjectNeed: ProjectNeed    = dbProject.Needs.find(n => n.ID === projectNeedID);
        const isValidRequest: boolean       = !!dbProject && !!dbProjectNeed;

        if (!isValidRequest) {
            throw new Error(this._localizationService.getText("validation.project.need.non-existent"));
        }
        dbProjectNeed.Tags.forEach(t => {
            this._projectNeedTagRepository.delete(t);
        });

        return this._repository.deleteByID(projectNeedID);

    }

}
