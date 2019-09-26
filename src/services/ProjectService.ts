import { inject, injectable }       from "inversify";
import { TYPES }                    from "../types";
import { ILocalizationService,
        IFileService,
        IProjectService,
        IProjectRepository,
        IProjectImageRepository,
        IUserService }              from "../contracts";
import { BaseService }              from "./BaseService";
import { Project,
    ProjectImage,
    ProjectNeed,
    ProjectUpdate,
    User }                          from "../models";
import { FileType }                 from "../enums/FileType";
import { ProjectStatusType }        from "../enums/ProjectStatusType";
import { UserRoleType }             from "../enums/UserRoleType";
import { VisibilityType }           from "../enums/VisibilityType";
import { CreateProjectDTO,
         MyProjectDTO,
         ProjectDTO,
         ProjectListItem,
         GetAllProjectsResponse }   from "../dtos/projects";
import { AWS }                      from "../utils";

@injectable()
export class ProjectService extends BaseService<Project> implements IProjectService {

    private readonly _userService: IUserService;
    private readonly _fileService: IFileService;
    private readonly _projectRepository: IProjectRepository;
    private readonly _projectImageRepository: IProjectImageRepository;

    constructor(
        @inject(TYPES.ProjectRepository) projectRepository: IProjectRepository,
        @inject(TYPES.ProjectImageRepository) projectImageRepository: IProjectImageRepository,
        @inject(TYPES.LocalizationService) localizationService: ILocalizationService,
        @inject(TYPES.FileService) fileService: IFileService,
        @inject(TYPES.UserService) userService: IUserService
    ) {
        super(projectRepository, localizationService);
        this._userService               = userService;
        this._fileService               = fileService;
        this._projectRepository         = projectRepository;
        this._projectImageRepository    = projectImageRepository;
    }

    public async createProject(email: string, createProjectDTO: CreateProjectDTO): Promise<Project> {
        const dbUser: User = await this._userService.getByEmail(email);

        const budget: number = +createProjectDTO.Budget || 0;

        const project: Project = {
            Name: createProjectDTO.Name,
            Description: createProjectDTO.Description,
            Email: createProjectDTO.Email,
            PhoneNumber: createProjectDTO.PhoneNumber,
            Date: createProjectDTO.Date,
            Budget: budget,
            Currency: createProjectDTO.Currency,
            City: createProjectDTO.City,
            Status: ProjectStatusType.Enabled,
            Visibility: createProjectDTO.Visibility,
            Initiator: dbUser
        } as Project;

        if (createProjectDTO.Image) {
            const uploadProjectImageResult: any = await this._fileService.uploadFile(createProjectDTO.Image, FileType.Image, email);

            const projectImage = {
                Key: uploadProjectImageResult.Key,
                Location: uploadProjectImageResult.Location,
                ThumbnailLocation: AWS.getThumbnailURL(uploadProjectImageResult.Key),
                Size: Math.round(createProjectDTO.Image.size * 100 / (1000 * 1000)) / 100, // in MB
            } as ProjectImage;

            project.Image = projectImage;
        }

        if (createProjectDTO.Needs) {
            const needs: ProjectNeed[] = typeof createProjectDTO.Needs === "string" ?
                                                    JSON.parse(createProjectDTO.Needs) : createProjectDTO.Needs;

            project.Needs = [];
            needs.forEach((n: ProjectNeed ) => {
                const need: ProjectNeed = {
                    Description: n.Description,
                    IsMandatory: n.IsMandatory
                } as ProjectNeed;

                project.Needs.push(need);
            });
        }

        project.Updates = [];
        project.Updates.push({
            Description: this._localizationService.getText("content.project-created")
        } as ProjectUpdate);

        const dbProject: Project = await this.create(project);

        return dbProject;
    }

    public async getProject(email: string, id: string, checkIfOwner: boolean = false): Promise<ProjectDTO> {
        let me: User;
        let fullViewingRights: boolean;
        const viewerIsVisitor: boolean = !email;
        let project: Project;
        let otherProjects: Project[];

        try {
            project = await this._projectRepository
                .runCreateQueryBuilder()
                .select("project")
                .from(Project, "project")
                .leftJoinAndSelect("project.Initiator", "initiator")
                .leftJoinAndSelect("initiator.ProfileImage", "profileImage")
                .leftJoinAndSelect("initiator.PhotoGallery", "photoGallery")
                .leftJoinAndSelect("project.Image", "image")
                .leftJoinAndSelect("project.Needs", "needs")
                .leftJoinAndSelect("project.Updates", "updates")
                .where("project.ID = :id AND project.Status = :status", { id, status: ProjectStatusType.Enabled })
                .getOne();

            if (!project) {
                return undefined;
            }

            const initiatorId: string = project.Initiator.ID;

            // check if only the initator is allowed to get the project (e.g. for editing project)
            if (checkIfOwner && project.Initiator.Email !== email) {
                throw new Error(this._localizationService.getText("validation.project.non-existent-project"));
            }

            // if email is null then the person making the request is a visitor
            if (!viewerIsVisitor) {
                me                = await this._userService.getByEmail(email);
                fullViewingRights = me.AccountSettings.Role === UserRoleType.Admin ||
                                    me.AccountSettings.Role === UserRoleType.SuperAdmin ||
                                    initiatorId === me.ID;
            }

            otherProjects = await this._projectRepository
                .runCreateQueryBuilder()
                .select("project")
                .from(Project, "project")
                .leftJoinAndSelect("project.Image", "image")
                .leftJoinAndSelect("project.Initiator", "initiator")
                .where("initiator.ID = :initiatorId AND project.ID != :id AND project.Status = :status", { initiatorId, id, status: ProjectStatusType.Enabled })
                .getMany();

            otherProjects = otherProjects.filter(p => {

                if (fullViewingRights) {
                    return true;
                }

                if (p.Visibility === VisibilityType.Private && !viewerIsVisitor && initiatorId === me.ID) {
                    return true;
                }

                if (p.Visibility === VisibilityType.Community && !viewerIsVisitor) {
                    return true;
                }

                if (p.Visibility === VisibilityType.Everyone) {
                    return true;
                }

                return false;
            });

            if (!project) {
                throw new Error(this._localizationService.getText("validation.project.non-existent-project"));
            }

        } catch (error) {
            return undefined;
        }

        if (project.Visibility === VisibilityType.Everyone) {
            return new ProjectDTO(project, otherProjects);
        }

        // if the person has admin rights or is the owner of the project then return the project
        if (fullViewingRights) {
            return new ProjectDTO(project, otherProjects);
        }

        if (project.Visibility === VisibilityType.Private) {
            return undefined;
        }

        if (project.Visibility === VisibilityType.Community && viewerIsVisitor) {
            return undefined;
        }

        return new ProjectDTO(project, otherProjects);
    }

    public async getMyProjects(email: string): Promise<MyProjectDTO[]> {
        const dbUser: User = await this._userService.getByEmail(email);

        return dbUser.Projects
        .sort((p1, p2) => p1.DateCreated > p2.DateCreated ? -1 : 1)
        .map(p => {
            return {
                ID: p.ID,
                Name: p.Name,
                Image: p.Image ? p.Image.ThumbnailLocation : "",
                Date: p.Date,
                City: p.City,
                Budget: p.Budget,
                Currency: p.Currency
            } as MyProjectDTO;
        });
    }

    public async getAllProjects(email: string, searchTerm: string, page: number, pageSize: number): Promise<GetAllProjectsResponse> {
        let me: User;
        let fullViewingRights: boolean;
        const viewerIsVisitor: boolean = !email;

        searchTerm                          = searchTerm.toLowerCase().replace(/\s\s+/g, " ").trim();
        const likeSearchTerm: string        = `%${searchTerm}%`;
        const normalizedSearchTerm: string  = searchTerm.replace(/\s/g, " & ");

        // if email is null then the person making the request is a visitor
        if (!viewerIsVisitor) {
            me                = await this._userService.getByEmail(email);
            fullViewingRights = me.AccountSettings.Role === UserRoleType.Admin ||
                                me.AccountSettings.Role === UserRoleType.SuperAdmin;
        }

        let projects: Project[];

        try {

            projects = await this._projectRepository
                .runCreateQueryBuilder()
                .select("project")
                .from(Project, "project")
                .leftJoinAndSelect("project.Initiator", "initiator")
                .leftJoinAndSelect("project.Image", "image")
                .leftJoinAndSelect("project.Needs", "needs")
                .where(
                    `project.Status = :status AND
                    (
                        (:searchTerm = '') IS NOT FALSE OR
                        LOWER(project.Name) like :likeSearchTerm OR
                        LOWER(project.Description) like :likeSearchTerm OR
                        ((select COUNT(*) from public."ProjectNeed" pn where pn."ProjectID" = project.ID AND LOWER(pn."Description") like :likeSearchTerm) > 0) OR
                        (project.SearchTokens @@ to_tsquery(:normalizedSearchTerm))
                    )`,
                    {
                        status: ProjectStatusType.Enabled,
                        searchTerm,
                        likeSearchTerm,
                        normalizedSearchTerm
                    }
                )
                .getMany();

            } catch (error) {
                return new GetAllProjectsResponse([], 0, 0, pageSize);
            }


        const filteredProjects: Project[] = projects
            .filter((p: Project) => {
                if (fullViewingRights) {
                    return true;
                }

                if (p.Visibility === VisibilityType.Private && !viewerIsVisitor && p.Initiator.ID === me.ID) {
                    return true;
                }

                if (p.Visibility === VisibilityType.Community && !viewerIsVisitor) {
                    return true;
                }

                if (p.Visibility === VisibilityType.Everyone) {
                    return true;
                }

                return false;
            });

            const items: ProjectListItem[] = filteredProjects
                .splice(page * pageSize, pageSize)
                .map((p: Project) => new ProjectListItem(p));

            const pageCount: number = Math.ceil(filteredProjects.length / pageSize);

            return new GetAllProjectsResponse(items, pageCount, page, pageSize);

    }

    public async getRandomProjects(count: number = 2): Promise<ProjectListItem[]> {
        const projects: Project[] = await this._projectRepository
                            .runCreateQueryBuilder()
                            .select("project")
                            .from(Project, "project")
                            .leftJoinAndSelect("project.Initiator", "initiator")
                            .where("project.Visibility = :everyone AND project.Status = :status", { everyone: VisibilityType.Everyone, status: ProjectStatusType.Enabled})
                            .orderBy("random()")
                            .limit(count)
                            .getMany();

        return projects.map(p => new ProjectListItem(p));
    }

    public async updateGeneralInformation(userEmail: string,
            generalInformationSection: ProjectDTO,
            projectImageFile: any): Promise<ProjectDTO> {

        const dbUser: User          = await this._userService.getByEmail(userEmail);
        const dbProject: Project    = dbUser.Projects.find(p => p.ID === generalInformationSection.ID);

        // only project initiator should be able to edit project information
        if (!dbProject) {
            return null;
        }

        const dbProjectImage: ProjectImage  = dbProject.Image;
        let projectImage: ProjectImage      = dbProjectImage;

        if (projectImageFile && !dbProjectImage) {
            const uploadProjectImageResult: any
                            = await this._fileService.uploadFile(projectImageFile, FileType.Image, userEmail);

            projectImage = {
                Key: uploadProjectImageResult.Key,
                Location: uploadProjectImageResult.Location,
                ThumbnailLocation: AWS.getThumbnailURL(uploadProjectImageResult.Key),
                Size: Math.round(projectImageFile.size * 100 / (1000 * 1000)) / 100, // in MB
            } as ProjectImage;

            projectImage = await this._projectImageRepository.insert(projectImage);
        } else if (projectImageFile && dbProjectImage) {
            const newProjectImageUploadPromise = this._fileService.uploadFile(projectImageFile, FileType.Image, userEmail);
            const oldProjectImageRemovePromise = this._fileService.deleteFile(dbProjectImage.Key);

            const updateProjectImageResults: any  = await Promise.all([newProjectImageUploadPromise, oldProjectImageRemovePromise]);

            projectImage.Location           = updateProjectImageResults[0].Location;
            projectImage.ThumbnailLocation  = AWS.getThumbnailURL(updateProjectImageResults[0].Key);
            projectImage.Key                = updateProjectImageResults[0].Key;
            projectImage.Size               = Math.round(projectImageFile.size * 100 / (1000 * 1000)) / 100;

            projectImage = await this._projectImageRepository.update(projectImage);
        } else if (!projectImageFile && !generalInformationSection.Image && dbProjectImage) {
            this._fileService.deleteFile(dbProjectImage.Key);
            this._projectImageRepository.deleteByID(dbProjectImage.ID);
            projectImage = undefined;
        }

        const budget: number = +generalInformationSection.Budget || 0;

        await this._projectRepository
            .runCreateQueryBuilder()
            .update(Project)
            .set({
                Name: generalInformationSection.Name,
                Description: generalInformationSection.Description,
                Email: generalInformationSection.Email,
                PhoneNumber: generalInformationSection.PhoneNumber,
                Date: generalInformationSection.Date,
                Budget: budget,
                Currency: generalInformationSection.Currency,
                City: generalInformationSection.City,
                Visibility: generalInformationSection.Visibility,
                Image: projectImage
            })
            .where("ID = :id", { id: generalInformationSection.ID })
            .execute();

        return {
            ...generalInformationSection,
            Budget: budget,
            Image: projectImage
        };
    }

    public async deleteProjectByID(email: string, projectID: string): Promise<Project> {
        const dbUser: User = await this._userService.getByEmail(email);

        if (!dbUser.Projects.find(p => p.ID === projectID)) {
            throw new Error(this._localizationService.getText("validation.project.non-existent"));
        }

        const project =  await this.deleteByID(projectID);
        await this._projectImageRepository.deleteByID(project.Image.ID);

        return project;
    }

}
