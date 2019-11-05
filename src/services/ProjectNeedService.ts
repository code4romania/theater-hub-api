import { inject, injectable }               from "inversify";
import * as _                               from "lodash";
import { TYPES }                            from "../types";
import {
    IProjectNeedService,
    ILocalizationService,
    IProjectService,
    IUserService,
    IProjectNeedRepository,
    ITagRepository}                         from "../contracts";
import { BaseService }                      from "./BaseService";
import { Project,
        ProjectNeed,
        Tag,
        User }                              from "../models";
import { CreateProjectNeedDTO,
    UpdateProjectNeedDTO }                  from "../dtos";

@injectable()
export class ProjectNeedService extends BaseService<ProjectNeed> implements IProjectNeedService {

    private readonly _tagRepository: ITagRepository;
    private readonly _projectService: IProjectService;
    private readonly _userService: IUserService;

    constructor(@inject(TYPES.ProjectNeedRepository) projectNeedRepository: IProjectNeedRepository,
                    @inject(TYPES.TagRepository) tagRepository: ITagRepository,
                    @inject(TYPES.LocalizationService) localizationService: ILocalizationService,
                    @inject(TYPES.ProjectService) projectService: IProjectService,
                    @inject(TYPES.UserService) userService: IUserService) {
        super(projectNeedRepository, localizationService);
        this._tagRepository                     = tagRepository;
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

            const tags: Tag[] = await this._tagRepository.getByIDs(createProjectNeedDTO.Tags);

            projectNeed.Tags = [
                ...tags
            ];
        }

        const response = await this._repository.insert(projectNeed);

        return response;

    }

    public async updateProjectNeed(email: string, updateProjectNeedDTO: UpdateProjectNeedDTO): Promise<void> {
        const dbUser: User                  = await this._userService.getByEmail(email);
        const dbProject: Project            = dbUser.Projects.find(p => p.ID === updateProjectNeedDTO.ProjectID);
        const dbProjectNeed: ProjectNeed    = dbProject.Needs.find(n => n.ID === updateProjectNeedDTO.ID);

        if (!dbProjectNeed) {
            throw new Error(this._localizationService.getText("validation.project.need.non-existent"));
        }

        if (!dbProjectNeed.Tags) {
            dbProjectNeed.Tags = [];
        }

        const dbTagIDs: string[]                = dbProjectNeed.Tags.map(t => t.ID);
        const addedIDs: string[]                = updateProjectNeedDTO.Tags.filter(t => dbTagIDs.indexOf(t) === -1);
        const addedTags: Tag[]                  = await this._tagRepository.getByIDs(addedIDs);
        const removedIDs: string[]              = dbTagIDs.filter(id => updateProjectNeedDTO.Tags.indexOf(id) === -1);

        dbProjectNeed.Tags = [
            ...dbProjectNeed.Tags.filter(t => removedIDs.indexOf(t.ID) === -1),
            ...addedTags
        ];

        dbProjectNeed.Description = updateProjectNeedDTO.Description;

        this._repository.update(dbProjectNeed);

    }

    public async deleteProjectNeedByID(email: string, projectID: string, projectNeedID: string): Promise<ProjectNeed> {
        const dbUser: User                  = await this._userService.getByEmail(email);
        const dbProject: Project            = dbUser.Projects.find(p => p.ID === projectID);
        const dbProjectNeed: ProjectNeed    = dbProject.Needs.find(n => n.ID === projectNeedID);
        const isValidRequest: boolean       = !!dbProject && !!dbProjectNeed;

        if (!isValidRequest) {
            throw new Error(this._localizationService.getText("validation.project.need.non-existent"));
        }

        return this._repository.deleteByID(projectNeedID);

    }

}
