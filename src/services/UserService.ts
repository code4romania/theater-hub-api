import { inject, injectable }                  from "inversify";
import * as _                                  from "lodash";
import axios                                   from "axios";
import * as moment                             from "moment";
import { TYPES }                               from "../types";
import { IUserService, IEmailService,
    IFileService, ILocalizationService,
    ISkillService,
    IAwardRepository,
    IEducationRepository,
    IExperienceRepository,
    IProfessionalRepository,
    IUserAccountSettingsRepository,
    IUserFileRepository,
    IUserImageRepository,
    IUserRepository,
    IUserVideoRepository,
    IUserSocialMediaRepository }               from "../contracts";
import { BaseService }                         from "./BaseService";
import { Award }                               from "../models/Award";
import { Education }                           from "../models/Education";
import { Experience }                          from "../models/Experience";
import { User }                                from "../models/User";
import { UserAccountSettings }                 from "../models/UserAccountSettings";
import { UserImage }                           from "../models/UserImage";
import { UserFile }                            from "../models/UserFile";
import { UserSocialMedia }                     from "../models/UserSocialMedia";
import { UserVideo }                           from "../models/UserVideo";
import { Professional }                        from "../models/Professional";
import { Skill }                               from "../models/Skill";
import { ChangePasswordResponseDTO,
    ChangePasswordRequestDTO,
    CommunitySkillLayer,
    CommunityMemberDTO,
    CreateProfileResponseDTO,
    GenerateResumeRequestDTO,
    CreateAccountEmailDTO,
    FinishRegistrationResponseDTO,
    GetCommunityLayersRequest,
    GetCommunityLayersResponse,
    GetCommunityMembersRequest,
    GetCommunityMembersResponse,
    ResetPasswordEmailDTO,
    ManagedUserRegistrationRequestDTO,
    ManagedUserRegistrationResponseDTO,
    MeDTO, ProfileDTO,
    ContactEmailDTO, RegisterDTO,
    ResetPasswordRequestDTO,
    SettingsDTO, UpdateProfileSection,
    UpdatePhotoGalleryResponse, UserImageDTO } from "../dtos";
import { EntityCategoryType }                  from "../enums/EntityCategoryType";
import { FileType }                            from "../enums/FileType";
import { FileCategoryType }                    from "../enums/FileCategoryType";
import { LocaleType }                          from "../enums/LocaleType";
import { SocialMediaCategoryType }             from "../enums/SocialMediaCategoryType";
import { SortOrientationType }                 from "../enums/SortOrientationType";
import { UserAccountProviderType }             from "../enums/UserAccountProviderType";
import { UserAccountStatusType }               from "../enums/UserAccountStatusType";
import { UserRoleType }                        from "../enums/UserRoleType";
import { VisibilityType }                      from "../enums/VisibilityType";
import { SocialMediaManager, Validators }      from "../utils";
const bcrypt                                   = require("bcryptjs");
const config                                   = require("../config/env").getConfig();
const jwt                                      = require("jsonwebtoken");
const uuidv4                                   = require("uuid/v4");
const fs                                       = require("fs");
const path                                     = require("path");
const pdf                                      = require("html-pdf");
const handlebars                               = require("handlebars");

@injectable()
export class UserService extends BaseService<User> implements IUserService {

    private readonly _awardRepository: IAwardRepository;
    private readonly _educationRepository: IEducationRepository;
    private readonly _experienceRepository: IExperienceRepository;
    private readonly _professionalRepository: IProfessionalRepository;
    private readonly _userAccountSettingsRepository: IUserAccountSettingsRepository;
    private readonly _userFileRepository: IUserFileRepository;
    private readonly _userImageRepository: IUserImageRepository;
    private readonly _userRepository: IUserRepository;
    private readonly _userSocialMediaRepository: IUserSocialMediaRepository;
    private readonly _userVideoRepository: IUserVideoRepository;
    private readonly _emailService: IEmailService;
    private readonly _fileService: IFileService;
    private readonly _skillService: ISkillService;

    constructor(
        @inject(TYPES.AwardRepository) awardRepository: IAwardRepository,
        @inject(TYPES.EducationRepository) educationRepository: IEducationRepository,
        @inject(TYPES.ExperienceRepository) experienceRepository: IExperienceRepository,
        @inject(TYPES.ProfessionalRepository) professionalRepository: IProfessionalRepository,
        @inject(TYPES.UserAccountSettingsRepository) userAccountSettingsRepository: IUserAccountSettingsRepository,
        @inject(TYPES.UserFileRepository) userFileRepository: IUserFileRepository,
        @inject(TYPES.UserImageRepository) userImageRepository: IUserImageRepository,
        @inject(TYPES.UserRepository) userRepository: IUserRepository,
        @inject(TYPES.UserSocialMediaRepository) userSocialMediaRepository: IUserSocialMediaRepository,
        @inject(TYPES.UserVideoRepository) userVideoRepository: IUserVideoRepository,
        @inject(TYPES.EmailService) emailService: IEmailService,
        @inject(TYPES.FileService) fileService: IFileService,
        @inject(TYPES.LocalizationService) localizationService: ILocalizationService,
        @inject(TYPES.SkillService) skillService: ISkillService
    ) {
        super(userRepository, localizationService);
        this._awardRepository                 = awardRepository;
        this._educationRepository             = educationRepository;
        this._experienceRepository            = experienceRepository;
        this._professionalRepository          = professionalRepository;
        this._userAccountSettingsRepository   = userAccountSettingsRepository;
        this._userFileRepository              = userFileRepository;
        this._userImageRepository             = userImageRepository;
        this._userRepository                  = userRepository;
        this._userSocialMediaRepository       = userSocialMediaRepository;
        this._userVideoRepository             = userVideoRepository;
        this._emailService                    = emailService;
        this._fileService                     = fileService;
        this._skillService                    = skillService;
    }

    public async deleteByID(id: string): Promise<User> {

        return this._userRepository
                .runCreateQueryBuilder()
                .delete()
                .from(User)
                .where("ID = :id", { id })
                .execute();
    }

    public async getMe(email: string): Promise<MeDTO> {
        const user: User    = await this.getByEmail(email);
        const me            = new MeDTO(user);

        if (me.ProfileImage) {
            me.ProfileImage.Location           = this._fileService.getPresignedURL(me.ProfileImage.Key);
            me.ProfileImage.ThumbnailLocation  = this._fileService.getSignedCloudFrontUrl(me.ProfileImage.ThumbnailLocation);
        }

        return me;
    }

    public async getMyProfile(email: string): Promise<ProfileDTO> {
        const user: User = await this.getByEmail(email);

        const profile           = new ProfileDTO(user, true);
        if (profile.ProfileImage) {
            profile.ProfileImage.Location           = this._fileService.getPresignedURL(profile.ProfileImage.Key);
            profile.ProfileImage.ThumbnailLocation  = this._fileService.getSignedCloudFrontUrl(profile.ProfileImage.ThumbnailLocation);
        }
        profile.PhotoGallery    = profile.PhotoGallery.map(p => {

            return {
                ...p,
                Location: this._fileService.getPresignedURL(p.Key),
                ThumbnailLocation: this._fileService.getSignedCloudFrontUrl(p.ThumbnailLocation)
            };
        });

        return profile;
    }

    public async deleteMe(email: string): Promise<ProfileDTO> {

        return this._userRepository
                .runCreateQueryBuilder()
                .delete()
                .from(User)
                .where("Email = :email", { email })
                .execute();
    }

    public async updateGeneralInformation(userEmail: string, generalInformationSection: ProfileDTO, profileImageFile: any): Promise<MeDTO> {
        const dbUser                = await this.getByEmail(userEmail);
        const dbProfileImage        = dbUser.ProfileImage || dbUser.PhotoGallery.find(p => p.IsProfileImage);
        let profileImage: UserImage = dbProfileImage;

        if (profileImageFile && !dbProfileImage) {
            const uploadProfileImageResult: any = await this._fileService.uploadFile(profileImageFile, FileType.Image, userEmail);

            profileImage = {
                Key: uploadProfileImageResult.Key,
                Location: uploadProfileImageResult.Location,
                ThumbnailLocation: this._fileService.getThumbnailURL(uploadProfileImageResult.Key),
                Size: Math.round(profileImageFile.size * 100 / (1000 * 1000)) / 100, // in MB
                IsProfileImage: true,
                User: dbUser
            } as UserImage;

            profileImage = await this._userImageRepository.insert(profileImage);
        } else if (profileImageFile && dbProfileImage) {
            const newProfileImageUploadPromise = this._fileService.uploadFile(profileImageFile, FileType.Image, userEmail);
            const oldProfileImageRemovePromise = this._fileService.deleteFile(dbProfileImage.Key);

            const updateProfileImageResults: any  = await Promise.all([newProfileImageUploadPromise, oldProfileImageRemovePromise]);

            profileImage.Location           = updateProfileImageResults[0].Location;
            profileImage.ThumbnailLocation  = this._fileService.getThumbnailURL(updateProfileImageResults[0].Key);
            profileImage.Key                = updateProfileImageResults[0].Key;
            profileImage.Size               = Math.round(profileImageFile.size * 100 / (1000 * 1000)) / 100;

            profileImage = await this._userImageRepository.update(profileImage);
        } else if (!profileImageFile && !generalInformationSection.ProfileImage && dbProfileImage) {
            this._fileService.deleteFile(dbProfileImage.Key);
            this._userImageRepository.deleteByID(dbProfileImage.ID);
            profileImage = undefined;
        }

        const facebookSocialMedia     = dbUser.SocialMedia.find(s => s.SocialMediaCategoryID === SocialMediaCategoryType.Facebook);
        const instagramSocialMedia    = dbUser.SocialMedia.find(s => s.SocialMediaCategoryID === SocialMediaCategoryType.Instagram);
        const linkedinSocialMedia     = dbUser.SocialMedia.find(s => s.SocialMediaCategoryID === SocialMediaCategoryType.Linkedin);
        const youtubeSocialMedia      = dbUser.SocialMedia.find(s => s.SocialMediaCategoryID === SocialMediaCategoryType.Youtube);

        if (generalInformationSection.FacebookLink && !facebookSocialMedia) {
            this._userSocialMediaRepository.insert({
                Link: generalInformationSection.FacebookLink,
                User: dbUser,
                SocialMediaCategoryID: SocialMediaCategoryType.Facebook
            } as UserSocialMedia);
        } else if (generalInformationSection.FacebookLink && facebookSocialMedia.Link !== generalInformationSection.FacebookLink) {
            facebookSocialMedia.Link = generalInformationSection.FacebookLink;
            this._userSocialMediaRepository.update(facebookSocialMedia);
        } else if (!generalInformationSection.FacebookLink && facebookSocialMedia) {
            this._userSocialMediaRepository.delete(facebookSocialMedia);
        }

        if (generalInformationSection.InstagramLink && !instagramSocialMedia) {
            this._userSocialMediaRepository.insert({
                Link: generalInformationSection.InstagramLink,
                User: dbUser,
                SocialMediaCategoryID: SocialMediaCategoryType.Instagram
            } as UserSocialMedia);
        } else if (generalInformationSection.InstagramLink && instagramSocialMedia.Link !== generalInformationSection.InstagramLink) {
            instagramSocialMedia.Link = generalInformationSection.InstagramLink;
            this._userSocialMediaRepository.update(instagramSocialMedia);
        } else if (!generalInformationSection.InstagramLink && instagramSocialMedia) {
            this._userSocialMediaRepository.delete(instagramSocialMedia);
        }

        if (generalInformationSection.LinkedinLink && !linkedinSocialMedia) {
            this._userSocialMediaRepository.insert({
                Link: generalInformationSection.LinkedinLink,
                User: dbUser,
                SocialMediaCategoryID: SocialMediaCategoryType.Linkedin
            } as UserSocialMedia);
        } else if (generalInformationSection.LinkedinLink && linkedinSocialMedia.Link !== generalInformationSection.LinkedinLink) {
            linkedinSocialMedia.Link = generalInformationSection.LinkedinLink;
            this._userSocialMediaRepository.update(linkedinSocialMedia);
        } else if (!generalInformationSection.LinkedinLink && linkedinSocialMedia) {
            this._userSocialMediaRepository.delete(linkedinSocialMedia);
        }

        if (generalInformationSection.YoutubeLink && !youtubeSocialMedia) {
            this._userSocialMediaRepository.insert({
                Link: generalInformationSection.YoutubeLink,
                User: dbUser,
                SocialMediaCategoryID: SocialMediaCategoryType.Youtube
            } as UserSocialMedia);
        } else if (generalInformationSection.YoutubeLink && youtubeSocialMedia.Link !== generalInformationSection.YoutubeLink) {
            youtubeSocialMedia.Link = generalInformationSection.YoutubeLink;
            this._userSocialMediaRepository.update(youtubeSocialMedia);
        } else if (!generalInformationSection.YoutubeLink && youtubeSocialMedia) {
            this._userSocialMediaRepository.delete(youtubeSocialMedia);
        }

        let username: string = dbUser.Username;

        if (generalInformationSection.FirstName !== dbUser.Professional.FirstName
                                    || generalInformationSection.LastName !== dbUser.Professional.LastName) {
            username = await this.getUsername(generalInformationSection.FirstName, generalInformationSection.LastName);
        }

        this._userRepository
                .runCreateQueryBuilder()
                .update(User)
                .set({
                    BirthDate: generalInformationSection.BirthDate,
                    PhoneNumber: generalInformationSection.PhoneNumber,
                    Description: generalInformationSection.Description,
                    Website: generalInformationSection.Website,
                    Name: `${generalInformationSection.FirstName} ${generalInformationSection.LastName}`,
                    Username: username,
                    ProfileImage: profileImage
                })
                .where("Email = :userEmail", { userEmail })
                .execute();

        this._professionalRepository
            .runCreateQueryBuilder()
            .update(Professional)
            .set({
                FirstName: generalInformationSection.FirstName,
                LastName: generalInformationSection.LastName
            })
            .where("ID = :ID", { ID: dbUser.Professional.ID })
            .execute();

        if (profileImage) {
            profileImage.Location           = this._fileService.getPresignedURL(profileImage.Key);
            profileImage.ThumbnailLocation  = this._fileService.getSignedCloudFrontUrl(profileImage.ThumbnailLocation);
        }

        const response: MeDTO = {
            FirstName: generalInformationSection.FirstName,
            LastName: generalInformationSection.LastName,
            Email: userEmail,
            ProfileImage: profileImage,
            Role: dbUser.AccountSettings.Role,
            AccountStatus: dbUser.AccountSettings.AccountStatus
        } as MeDTO;

        return response;
    }

    public async updateSkills(userEmail: string, skillsSection: number[]): Promise<void> {
        const dbUser                         = await this.getByEmail(userEmail);
        const dbUserSkillsIDs: number[]      = dbUser.Professional.Skills.map(s => s.ID);
        const addedEntitiesIDs: number[]     = skillsSection.filter(id => dbUserSkillsIDs.indexOf(id) === -1);
        const addedEntities: Skill[]         = await this._skillService.getByIDs(addedEntitiesIDs.map(e => e.toString()));
        const removedEntitiesIDs: number[]   = dbUserSkillsIDs.filter(id => skillsSection.indexOf(id) === -1);
        const resultingSkillIDs: number[]    = _.union(dbUserSkillsIDs, addedEntitiesIDs).filter(id => removedEntitiesIDs.indexOf(id) === -1);

        if (resultingSkillIDs.length === 0) {
            throw new Error(this._localizationService.getText("validation.skills.required"));
        }

        dbUser.Professional.Skills = [
            ...dbUser.Professional.Skills.filter(s => removedEntitiesIDs.indexOf(s.ID) === -1),
            ...addedEntities
        ];

        this._professionalRepository.update(dbUser.Professional);

    }

    public async updatePhotoGallery(userEmail: string, photoGallerySection: UserImage[], addedPhotos: any): Promise<UpdatePhotoGalleryResponse> {
        const dbUser                        = await this.getByEmail(userEmail);
        const dbPhotoGalleryIDs: string[]   = dbUser.PhotoGallery.filter(p => !p.IsProfileImage).map(p => p.ID);
        const photoGalleryIDs: string[]     = photoGallerySection.map(p => p.ID);
        const removedEntitiesIDs: string[]  = dbPhotoGalleryIDs.filter(id => photoGalleryIDs.indexOf(id) === -1);
        const addedEntities: UserImageDTO[] = [];

        let removedEntities: UserImage[] = [];

        if (removedEntitiesIDs.length !== 0) {
            removedEntities = await this._userImageRepository
                .runCreateQueryBuilder()
                .select("userImage")
                .from(UserImage, "userImage")
                .where("userImage.ID IN (:...removedEntitiesIDs)", { removedEntitiesIDs })
                .getMany();
        }

        const photosUploadPromise = this._fileService.uploadFiles(addedPhotos, FileType.Image, userEmail);
        const photosRemovePromise = this._fileService.deleteFiles(removedEntities.map(e => e.Key));

        const updatePhotoGalleryResults: any  = await Promise.all([photosUploadPromise, photosRemovePromise]);

        for (let index = 0; index <  updatePhotoGalleryResults[0].length; index++) {
            const photo: UserImage = {
                Key: updatePhotoGalleryResults[0][index].Key,
                Location: updatePhotoGalleryResults[0][index].Location,
                ThumbnailLocation: this._fileService.getThumbnailURL(updatePhotoGalleryResults[0][index].Key),
                Size: Math.round(addedPhotos[index].size * 100 / (1000 * 1000)) / 100, // in MB
                IsProfileImage: false,
                User: dbUser
            } as UserImage;

            const addedEntity               = await this._userImageRepository.insert(photo);
            addedEntity.Location            = this._fileService.getPresignedURL(addedEntity.Key);
            addedEntity.ThumbnailLocation   = this._fileService.getSignedCloudFrontUrl(addedEntity.ThumbnailLocation);

            addedEntities.push(addedEntity);
        }

        for (let index = 0; index <  updatePhotoGalleryResults[1].length; index++) {
            await this._userImageRepository.deleteByID(removedEntities[index].ID);
        }

        return new UpdatePhotoGalleryResponse(addedEntities);
    }

    public async updateVideoGallery(userEmail: string, videoGallerySection: UpdateProfileSection<UserVideo>): Promise<void> {
        const dbUser                       = await this.getByEmail(userEmail);
        const dbVideoGalleryIDs: string[]  = dbUser.VideoGallery.map(p => p.ID);
        const addedEntities: UserVideo[]   = videoGallerySection.AddedEntities ? videoGallerySection.AddedEntities : [];
        const removedEntitiesIDs: string[] = videoGallerySection.RemovedEntities ?
                                    videoGallerySection.RemovedEntities.filter(id => dbVideoGalleryIDs.indexOf(id) !== -1) :
                                    [];
        const updatedEntities: UserVideo[] = videoGallerySection.UpdatedEntities ? videoGallerySection.UpdatedEntities : [];

        const addedEntitiesTitleResults: string[]   = await Promise.all(
            addedEntities.map(v => this.getVideoTitle(v.Video))
        );

        addedEntities.forEach(async (v: UserVideo, index: number) => {
            const video: UserVideo = {
                Video: v.Video,
                Title: addedEntitiesTitleResults[index],
                User: dbUser
            } as UserVideo;

            this._userVideoRepository.insert(video);
        });

        const updatedEntitiesTitleResults: string[]   = await Promise.all(
            updatedEntities.map(v => this.getVideoTitle(v.Video))
        );

         const updatedEntitiesIDs: string[] = updatedEntities.map(v => v.ID);
         const dbUserVideos: UserVideo[] = await this._userVideoRepository
            .runCreateQueryBuilder()
            .select("userVideo")
            .from(UserVideo, "userVideo")
            .where("userVideo.ID IN (:...updatedEntitiesIDs)", { updatedEntitiesIDs  })
            .getMany();

        dbUserVideos.forEach(async (v: UserVideo, index: number) => {
            v.Video = updatedEntities.find(e => e.ID === v.ID).Video;
            v.Title = updatedEntitiesTitleResults[index];

            this._userVideoRepository.update(v);
        });

        removedEntitiesIDs.forEach(async id => {
            this._userVideoRepository.deleteByID(id);
        });

    }

    public async updateAwards(userEmail: string, awardsSection: UpdateProfileSection<Award>): Promise<void> {
        const dbUser                       = await this.getByEmail(userEmail);
        const dbAwardsIDs: string[]        = dbUser.Awards.map(a => a.ID);
        const addedEntities: Award[]       = awardsSection.AddedEntities ? awardsSection.AddedEntities : [];
        const removedEntitiesIDs: string[] = awardsSection.RemovedEntities ?
                                    awardsSection.RemovedEntities.filter(id => dbAwardsIDs.indexOf(id) !== -1) :
                                    [];
        const updatedEntities: Award[]     = awardsSection.UpdatedEntities ? awardsSection.UpdatedEntities : [];

        addedEntities.forEach(async a => {
            const award: Award = {
                Title: a.Title,
                Issuer: a.Issuer,
                Description: a.Description,
                Date: a.Date,
                User: dbUser
            } as Award;

            this._awardRepository.insert(award);
        });

        for (const entity of updatedEntities) {
            const dbAward = await this._awardRepository.getByID(entity.ID);

            dbAward.Title          = entity.Title;
            dbAward.Issuer         = entity.Issuer;
            dbAward.Description    = entity.Description;
            dbAward.Date           = entity.Date;

            this._awardRepository.update(dbAward);
        }

        removedEntitiesIDs.forEach(async id => {
            this._awardRepository.deleteByID(id);
        });

    }

    public async updateExperience(userEmail: string, experienceSection: UpdateProfileSection<Experience>): Promise<void> {
        const dbUser                           = await this.getByEmail(userEmail);
        const dbExperienceIDs: string[]        = dbUser.Professional.Experience.map(e => e.ID);
        const addedEntities: Experience[]      = experienceSection.AddedEntities ? experienceSection.AddedEntities : [];
        const removedEntitiesIDs: string[]     = experienceSection.RemovedEntities ?
                                        experienceSection.RemovedEntities.filter(id => dbExperienceIDs.indexOf(id) !== -1) :
                                        [];
        const updatedEntities: Experience[]    = experienceSection.UpdatedEntities ? experienceSection.UpdatedEntities : [];

        addedEntities.forEach(async e => {
            const experience: Experience = {
                Position: e.Position,
                Employer: e.Employer,
                Description: e.Description,
                StartDate: e.StartDate,
                EndDate: e.EndDate,
                Professional: dbUser.Professional
            } as Experience;

            this._experienceRepository.insert(experience);
        });

        for (const entity of updatedEntities) {
            const dbExperience = await this._experienceRepository.getByID(entity.ID);

            dbExperience.Position       = entity.Position;
            dbExperience.Employer       = entity.Employer;
            dbExperience.Description    = entity.Description;
            dbExperience.StartDate      = entity.StartDate;
            dbExperience.EndDate        = entity.EndDate;

            this._experienceRepository.update(dbExperience);
        }

        experienceSection.RemovedEntities.forEach(async id => {
            this._experienceRepository.deleteByID(id);
        });

    }

    public async updateEducation(userEmail: string, educationSection: UpdateProfileSection<Education>): Promise<void> {
        const dbUser                           = await this.getByEmail(userEmail);
        const dbEducationIDs: string[]         = dbUser.Professional.Education.map(e => e.ID);
        const addedEntities: Education[]       = educationSection.AddedEntities ? educationSection.AddedEntities : [];
        const removedEntitiesIDs: string[]     = educationSection.RemovedEntities ?
                                            educationSection.RemovedEntities.filter(id => dbEducationIDs.indexOf(id) !== -1) :
                                            [];
        const updatedEntities: Education[]     = educationSection.UpdatedEntities ? educationSection.UpdatedEntities : [];

        addedEntities.forEach(async e => {
            const education: Education = {
                Title: e.Title,
                Institution: e.Institution,
                Description: e.Description,
                StartDate: e.StartDate,
                EndDate: e.EndDate,
                Professional: dbUser.Professional
            } as Education;

            this._educationRepository.insert(education);
        });

        for (const entity of updatedEntities) {
            const dbEducation = await this._educationRepository.getByID(entity.ID);

            dbEducation.Title         = entity.Title;
            dbEducation.Institution   = entity.Institution;
            dbEducation.Description   = entity.Description;
            dbEducation.StartDate     = entity.StartDate;
            dbEducation.EndDate       = entity.EndDate;

            this._educationRepository.update(dbEducation);
        }

        removedEntitiesIDs.forEach(async id => {
            this._educationRepository.deleteByID(id);
        });

    }

    public async getByEmail(email: string): Promise<User> {
        return this._userRepository.getByEmail(email);
    }

    public async contact(model: ContactEmailDTO): Promise<void> {
        this._emailService.setLocale(this._localizationService.getLocale());

        this._emailService.sendContactEmail(model);
    }

    public async register(register: RegisterDTO, accountProvider: UserAccountProviderType): Promise<User> {

        const dbUser: User = await this.getByEmail(register.Email);

        if (dbUser && dbUser.AccountSettings.AccountStatus !== UserAccountStatusType.Registered) {
            throw new Error(this._localizationService.getText("validation.email.in-use"));
        } else if (!!dbUser) {
            // Delete previous unfinished registration attempt.
            this.deleteByID(dbUser.ID);
        }

        const saltRounds: number              = 10;
        let passwordHash                      = "";
        const isLocalAccountProvider: boolean = accountProvider === UserAccountProviderType.Local;

        if (isLocalAccountProvider) {
            // TODO: refactor to make hashing the password async
            const passwordSalt           = bcrypt.genSaltSync(saltRounds);
            passwordHash                 = bcrypt.hashSync(register.Password, passwordSalt);
        }

        const registrationID: string = uuidv4();
        const registrationIDSalt     = bcrypt.genSaltSync(saltRounds);
        const registrationIDHash     = bcrypt.hashSync(registrationID, registrationIDSalt);

        // Generate username
        const firstName: string = register.FirstName.toLowerCase();
        const lastName: string  = register.LastName.toLowerCase();

        const username: string  =  await this.getUsername(firstName, lastName);

        const user: User = {
            Email:              register.Email,
            Name:               `${register.FirstName} ${register.LastName}`,
            PasswordHash:       passwordHash,
            Username:           username
        } as User;

        user.AccountSettings = {
            RegistrationIDHash:     registrationIDHash,
            EntityCategory:         EntityCategoryType.Professional,
            AccountProvider:        accountProvider,
            AccountStatus:          isLocalAccountProvider ? UserAccountStatusType.Registered : UserAccountStatusType.Confirmed,
            Role:                   UserRoleType.User,
            ProfileVisibility:      VisibilityType.Private,
            EmailVisibility:        VisibilityType.Private,
            BirthDateVisibility:    VisibilityType.Private,
            PhoneNumberVisibility:  VisibilityType.Private,
            Locale:                 this._localizationService.getLocale()
        } as UserAccountSettings;

        user.Professional  = {
            FirstName: register.FirstName,
            LastName:  register.LastName
        } as Professional;

        if (isLocalAccountProvider) {
            const createAccountEmailDTO: CreateAccountEmailDTO = {
                  UserEmailAddress:     register.Email,
                  UserFullName:         `${register.FirstName} ${register.LastName}`,
                  UserRegistrationID:   registrationID
            } as CreateAccountEmailDTO;

            this._emailService.setLocale(this._localizationService.getLocale());

            this._emailService.sendCreateAccountEmail(createAccountEmailDTO);
        }

        return this.create(user);

    }

    public async managedUserRegistration(request: ManagedUserRegistrationRequestDTO): Promise<ManagedUserRegistrationResponseDTO> {

        const dbUser: User = await this.getByEmail(request.Email);

        const saltRounds: number = 10;

        // TODO: refactor to make hashing the password async
        const passwordSalt           = bcrypt.genSaltSync(saltRounds);
        const passwordHash           = bcrypt.hashSync(request.Password, passwordSalt);

        dbUser.Name         = `${request.FirstName} ${request.LastName}`;
        dbUser.PasswordHash = passwordHash;
        dbUser.Username     = await this.getUsername(request.FirstName, request.LastName);

        this._userRepository
            .runCreateQueryBuilder()
            .update(User)
            .set({
                Name: `${request.FirstName} ${request.LastName}`,
                PasswordHash: passwordHash
            })
            .where("Email = :email", { email: request.Email })
            .execute();

        this._professionalRepository
            .runCreateQueryBuilder()
            .update(Professional)
            .set({
                FirstName: request.FirstName,
                LastName: request.LastName
            })
            .where("ID = :ID", { ID: dbUser.Professional.ID })
            .execute();

        const dbUserAccountSettings         = await this._userAccountSettingsRepository.getByID(dbUser.AccountSettings.ID);
        dbUserAccountSettings.AccountStatus = UserAccountStatusType.Confirmed;
        await this._userAccountSettingsRepository.update(dbUserAccountSettings);

        return {
            Role: dbUserAccountSettings.Role,
            Token: jwt.sign({
                firstName: dbUser.Professional.FirstName,
                lastName: dbUser.Professional.LastName,
                email: request.Email,
                role: dbUserAccountSettings.Role,
                accountStatus: dbUserAccountSettings.AccountStatus
            }, config.application.tokenSecret)
        } as ManagedUserRegistrationResponseDTO;
    }

    public async isValidRegistrationID(email: string, registrationID: string): Promise<boolean> {

        const dbUser: User = await this._userRepository.getByEmail(email);

        if (!dbUser ||
            (dbUser.AccountSettings.AccountStatus !== UserAccountStatusType.Managed &&
                dbUser.AccountSettings.AccountStatus !== UserAccountStatusType.Registered
                                    && dbUser.AccountSettings.AccountStatus !== UserAccountStatusType.Confirmed)) {
            return false;
        }

        const isRegistrationIDCorrect = bcrypt.compareSync(registrationID, dbUser.AccountSettings.RegistrationIDHash);

        return isRegistrationIDCorrect;
    }

    public async finishRegistration(email: string): Promise<FinishRegistrationResponseDTO> {

        const dbUser: User                  = await this._userRepository.getByEmail(email);

        const dbUserAccountSettings         = await this._userAccountSettingsRepository.getByID(dbUser.AccountSettings.ID);

        if (dbUserAccountSettings.AccountStatus === UserAccountStatusType.Registered) {
            dbUserAccountSettings.AccountStatus = UserAccountStatusType.Confirmed;
            this._userAccountSettingsRepository.update(dbUserAccountSettings);
        }

        const response: FinishRegistrationResponseDTO = {
            Token: jwt.sign({
                firstName: dbUser.Professional.FirstName,
                lastName: dbUser.Professional.LastName,
                email,
                role: dbUserAccountSettings.Role,
                accountStatus: dbUserAccountSettings.AccountStatus
            }, config.application.tokenSecret)
        };

        return response;
    }

    public async forgotPassword(email: string): Promise<void> {
        const dbUser: User                     = await this.getByEmail(email);
        const saltRounds: number               = 10;
        const resetForgottenPasswordID: string = uuidv4();
        const resetForgottenPasswordIDSalt     = bcrypt.genSaltSync(saltRounds);
        const resetForgottenPasswordIDHash     = bcrypt.hashSync(resetForgottenPasswordID, resetForgottenPasswordIDSalt);

        const dbUserAccountSettings                            = await this._userAccountSettingsRepository.getByID(dbUser.AccountSettings.ID);
        dbUserAccountSettings.ResetForgottenPasswordIDHash     = resetForgottenPasswordIDHash;
        dbUserAccountSettings.ResetForgottenPasswordExpiration = moment().add(1, "days").toDate();
        this._userAccountSettingsRepository.update(dbUserAccountSettings);

        const resetPasswordEmailModel = {
            UserEmaiAddress: email,
            UserFullName: dbUser.Name,
            UserResetForgottenPasswordID: resetForgottenPasswordID
        } as ResetPasswordEmailDTO;

        this._emailService.setLocale(this._localizationService.getLocale());

        this._emailService.sendResetPasswordEmail(resetPasswordEmailModel);
    }

    public async isValidResetForgottenPasswordID(email: string, resetForgottenPasswordID: string): Promise<boolean> {

        const dbUser: User = await this._userRepository.getByEmail(email);

        if (!dbUser || moment().isAfter(dbUser.AccountSettings.ResetForgottenPasswordExpiration)) {
            return false;
        }

        const isResetForgottenPasswordIDCorrect = bcrypt.compareSync(resetForgottenPasswordID, dbUser.AccountSettings.ResetForgottenPasswordIDHash);

        return isResetForgottenPasswordIDCorrect;
    }

    public async newPassword(password: string, generateToken: boolean = false, email?: string, user?: User) {

        email = email || user.Email;

        const saltRounds: number = 10;
        const passwordSalt       = bcrypt.genSaltSync(saltRounds);

        this._userRepository
            .runCreateQueryBuilder()
            .update(User)
            .set({
                PasswordHash: bcrypt.hashSync(password, passwordSalt)
            })
            .where("Email = :email", { email })
            .execute();

        if (generateToken) {

            if (!user) {
                user = await this._userRepository.getByEmail(email);
            }

            return jwt.sign({
                firstName: user.Professional.FirstName,
                lastName: user.Professional.LastName,
                email,
                role: user.AccountSettings.Role,
                accountStatus: user.AccountSettings.AccountStatus
            }, config.application.tokenSecret);
        }

    }

    public async resetPassword(resetPasswordRequest: ResetPasswordRequestDTO): Promise<void> {

        this.newPassword(resetPasswordRequest.Password, false, resetPasswordRequest.Email);
    }

    public async changePassword(email: string, changePasswordRequest: ChangePasswordRequestDTO): Promise<ChangePasswordResponseDTO> {

        const token: string = await this.newPassword(changePasswordRequest.NewPassword, true, email);

        const response: ChangePasswordResponseDTO = {
            Token: token
        };

        return response;
    }

    public async createProfile(profile: ProfileDTO): Promise<CreateProfileResponseDTO> {

        const user: User = await this._userRepository.getByEmail(profile.Email);

        if (user.AccountSettings.AccountStatus !== UserAccountStatusType.Confirmed) {
            return;
        }

        // General Information

        if (profile.ProfileImage.Location) {
            const profileImage: UserImage = {
                Key: profile.ProfileImage.Key,
                Location: profile.ProfileImage.Location,
                ThumbnailLocation: profile.ProfileImage.ThumbnailLocation,
                Size: Math.round(profile.ProfileImage.Size * 100 / (1000 * 1000)) / 100, // in MB
                IsProfileImage: true
            } as UserImage;

            user.ProfileImage = profileImage;
        }

        user.BirthDate     = new Date(profile.BirthDate);
        user.PhoneNumber   = profile.PhoneNumber;
        user.Website       = profile.Website;
        user.Description   = profile.Description;

        // Skills
        if (profile.Skills) {

            const profileSkills: string[] = profile.Skills && typeof profile.Skills === "string" ?
                                                                    (profile.Skills as string).split(",") : profile.Skills;

            const skills: Skill[] = await this._skillService.getByIDs(profileSkills);

            user.Professional.Skills = [...skills];
        }

        // Portfolio

        if (profile.PhotoGallery.length !== 0) {

            profile.PhotoGallery.forEach(p => {
                const photo: UserImage = {
                    Key: p.Key,
                    Location: p.Location,
                    ThumbnailLocation: p.ThumbnailLocation,
                    Size: Math.round(p.Size * 100 / (1000 * 1000)) / 100, // in MB
                    IsProfileImage: false
                } as UserImage;

                user.PhotoGallery.push(photo);
            });
        }

        if (profile.VideoGallery) {

            const videoGallery: UserVideo[]     = typeof profile.VideoGallery === "string" ?
                                                    JSON.parse(profile.VideoGallery) :
                                                    profile.VideoGallery;

            const videoTitleResults: string[]   = await Promise.all(
                videoGallery.map(v => this.getVideoTitle(v.Video))
            );

            videoGallery.forEach((v: UserVideo, index: number) => {

                const video: UserVideo = {
                    Video: v.Video,
                    Title: videoTitleResults[index],
                    User: user
                } as UserVideo;

                user.VideoGallery.push(video);
            });
        }

        // Awards

        if (profile.Awards) {

            const awards: Award[] = typeof profile.Awards === "string" ? JSON.parse(profile.Awards) : profile.Awards;

            awards.forEach(a => {
                const award: Award = {
                    Title: a.Title,
                    Issuer: a.Issuer,
                    Description: a.Description,
                    Date: a.Date,
                    User: user
                } as Award;

                user.Awards.push(award);
            });
        }

        // Experience

        if (profile.Experience) {

            const experienceSteps: Experience[] = typeof profile.Experience === "string" ? JSON.parse(profile.Experience) : profile.Experience;

            experienceSteps.forEach(e => {
                const experience: Experience = {
                    Position: e.Position,
                    Employer: e.Employer,
                    Description: e.Description,
                    StartDate: e.StartDate,
                    EndDate: e.EndDate,
                    Professional: user.Professional
                } as Experience;

                user.Professional.Experience.push(experience);
            });

        }

        // Education

        if (profile.Education) {

            const educationSteps: Education[] = typeof profile.Education === "string" ? JSON.parse(profile.Education) : profile.Education;

            educationSteps.forEach(e => {
                const education: Education = {
                    Title: e.Title,
                    Institution: e.Institution,
                    Description: e.Description,
                    StartDate: e.StartDate,
                    EndDate: e.EndDate,
                    Professional: user.Professional
                } as Education;

                user.Professional.Education.push(education);
            });
        }

        // Social media

        if (profile.FacebookLink) {
            user.SocialMedia.push({
                Link: profile.FacebookLink,
                UserID: user.ID,
                SocialMediaCategoryID: SocialMediaCategoryType.Facebook
            } as UserSocialMedia);
        }

        if (profile.InstagramLink) {
            user.SocialMedia.push({
                Link: profile.InstagramLink,
                User: user,
                UserID: user.ID,
                SocialMediaCategoryID: SocialMediaCategoryType.Instagram
            } as UserSocialMedia);
        }

        if (profile.LinkedinLink) {
            user.SocialMedia.push({
                Link: profile.LinkedinLink,
                User: user,
                UserID: user.ID,
                SocialMediaCategoryID: SocialMediaCategoryType.Linkedin
            } as UserSocialMedia);
        }

        if (profile.YoutubeLink) {
            user.SocialMedia.push({
                Link: profile.YoutubeLink,
                User: user,
                UserID: user.ID,
                SocialMediaCategoryID: SocialMediaCategoryType.Youtube
            } as UserSocialMedia);
        }

        // Privacy

        user.AccountSettings.ProfileVisibility       = profile.ProfileVisibility;
        user.AccountSettings.EmailVisibility         = profile.EmailVisibility;
        user.AccountSettings.BirthDateVisibility     = profile.BirthDateVisibility;
        user.AccountSettings.PhoneNumberVisibility   = profile.PhoneNumberVisibility;

        user.AccountSettings.Locale                  = profile.Locale;

        user.AccountSettings.AccountStatus  = UserAccountStatusType.Enabled;

        await this.update(user);

        const me = new MeDTO(user);
        if (me.ProfileImage) {
            me.ProfileImage.Location           = this._fileService.getPresignedURL(me.ProfileImage.Key);
            me.ProfileImage.ThumbnailLocation  = this._fileService.getSignedCloudFrontUrl(me.ProfileImage.ThumbnailLocation);
        }

        const response: CreateProfileResponseDTO = {
            Token: jwt.sign({
                firstName: user.Professional.FirstName,
                lastName: user.Professional.LastName,
                email: user.Email,
                role: user.AccountSettings.Role,
                accountStatus: user.AccountSettings.AccountStatus
            }, config.application.tokenSecret),
            Me: me,
            Locale: profile.Locale
        };

        return response;

    }

    public async generateResume(request: GenerateResumeRequestDTO): Promise<any> {
        this._localizationService.setLocale(request.Locale);

        const dbUser: User        = await this._userRepository.getByEmail(request.Email);
        const profile: ProfileDTO = new ProfileDTO(dbUser);
        const resumeHTML: string  = fs.readFileSync(path.join(process.cwd(), "src/views/resume", "Resume.html"), "utf8");

        const currentDateMoment       = moment(new Date());
        const birthDateMoment         = moment(dbUser.BirthDate);
        const age                     = Math.floor(moment.duration(currentDateMoment.diff(birthDateMoment)).asYears());
        const skills                  = dbUser.Professional.Skills
                                        .map(s => this._localizationService.getText(`application-data.skills.${s.ID}`))
                                        .sort();
        const awards                  = profile.Awards.map(a => {
            return {
                title: a.Title,
                issuer: a.Issuer,
                date: moment(a.Date).format("MM/YYYY"),
                description: a.Description
            };
        });
        const experience              = profile.Experience.map(e => {
            return {
                position: e.Position,
                employerName: e.Employer,
                startDate: moment(e.StartDate).format("MM/YYYY"),
                endDate: e.EndDate ? moment(e.EndDate).format("MM/YYYY") : this._localizationService.getText("resume.present"),
                description: e.Description
            };
        });
        const education              = profile.Education.map(e => {
            return {
                title: e.Title,
                institutionName: e.Institution,
                startDate: moment(e.StartDate).format("MM/YYYY"),
                endDate: e.EndDate ? moment(e.EndDate).format("MM/YYYY") : this._localizationService.getText("resume.present"),
                description: e.Description
            };
        });

        const videos = profile.VideoGallery ?
                profile.VideoGallery.map(v => {
                    return {
                        Link: v.Video,
                        Title: v.Title
                    };
                }) :
                undefined;

        const context = {
            profileImageLocation: profile.ProfileImage ? this._fileService.getPresignedURL(profile.ProfileImage.Key) : "",
            fullNameValue: dbUser.Name,
            ageValue: age,
            emailValue: profile.Email,
            phoneNumberValue: profile.PhoneNumber,
            websiteValue: profile.Website,
            facebookValue: profile.FacebookLink,
            instagramValue: profile.InstagramLink,
            linkedinValue: profile.LinkedinLink,
            youtubeValue: profile.YoutubeLink,
            descriptionValue: dbUser.Description,
            skills,
            photoGalleryImages: profile.PhotoGallery ? profile.PhotoGallery.map(p => this._fileService.getSignedCloudFrontUrl(p.ThumbnailLocation)) : undefined,
            videos: videos,
            hasAchievements: awards || experience || education,
            awards,
            experience,
            education,
            years: this._localizationService.getText("resume.years"),
            email: this._localizationService.getText("resume.e-mail"),
            phoneNumber: this._localizationService.getText("resume.phone-number"),
            website: this._localizationService.getText("resume.website"),
            descriptionTitle: this._localizationService.getText("resume.description-title"),
            skillsTitle: this._localizationService.getText("resume.skills-title"),
            photoGalleryTitle: this._localizationService.getText("resume.photo-gallery-title"),
            videoGalleryTitle: this._localizationService.getText("resume.video-gallery-title"),
            achievementsTitle: this._localizationService.getText("resume.achievements-title"),
            awardsTitle: this._localizationService.getText("resume.awards-title"),
            experienceTitle: this._localizationService.getText("resume.experience-title"),
            educationTitle: this._localizationService.getText("resume.education-title"),
            isFullZoom: process.platform.indexOf("win") !== -1
        };

        const options  = {
            "renderDelay": 100,
            "width": "1020px",
            "border": "40px"
        };

        const template = handlebars.compile(resumeHTML);

        return pdf.create(template(context), options);
    }

    public async getSettings(email: string): Promise<SettingsDTO> {
        const dbUser: User = await this._userRepository.getByEmail(email);

        const settings = {
            ProfileVisibility: dbUser.AccountSettings.ProfileVisibility,
            EmailVisibility: dbUser.AccountSettings.EmailVisibility,
            BirthDateVisibility: dbUser.AccountSettings.BirthDateVisibility,
            PhoneNumberVisibility: dbUser.AccountSettings.PhoneNumberVisibility,
            Locale: dbUser.AccountSettings.Locale
        } as SettingsDTO;

        return settings;
    }

    public async updateSettings(email: string, settings: SettingsDTO): Promise<void> {
        const dbUser: User                  = await this._userRepository.getByEmail(email);
        const dbUserAccountSettings         = await this._userAccountSettingsRepository.getByID(dbUser.AccountSettings.ID);

        dbUserAccountSettings.ProfileVisibility       = settings.ProfileVisibility;
        dbUserAccountSettings.EmailVisibility         = settings.EmailVisibility;
        dbUserAccountSettings.BirthDateVisibility     = settings.BirthDateVisibility;
        dbUserAccountSettings.PhoneNumberVisibility   = settings.PhoneNumberVisibility;
        dbUserAccountSettings.Locale                  = settings.Locale;

        this._userAccountSettingsRepository.update(dbUserAccountSettings);
    }

    public async getCommunityLayers(request: GetCommunityLayersRequest): Promise<GetCommunityLayersResponse> {
        let me: User;
        let fullViewingRights: boolean;
        const viewerIsVisitor: boolean  = !request.MyEmail;
        const searchTerm: string        = request.SearchTerm.toLowerCase().replace(/\s\s+/g, " ").trim();
        const skills: Skill[]           = await this._skillService.getAll();

        const likeSearchTerm: string        = `%${searchTerm}%`;
        const normalizedSearchTerm: string  = searchTerm.replace(/\s/g, " & ");

        let selectedUsers: User[] = await this._userRepository
                        .runCreateQueryBuilder()
                        .select("user")
                        .from(User, "user")
                        .leftJoinAndSelect("user.ProfileImage", "profileImage")
                        .innerJoinAndSelect("user.Professional", "professional")
                        .innerJoinAndSelect("user.AccountSettings", "accountSettings")
                        .innerJoinAndSelect("professional.Skills", "skills")
                        .addSelect()
                        .where(
                            `accountSettings.AccountStatus <> :disabledStatus AND
                            (
                                (:searchTerm = '') IS NOT FALSE OR
                                LOWER(user.Name) like :likeSearchTerm OR
                                LOWER(user.Description) like :likeSearchTerm OR
                                (user.SearchTokens @@ to_tsquery(:normalizedSearchTerm))
                            )`,
                            {
                                disabledStatus: UserAccountStatusType.Disabled,
                                searchTerm,
                                likeSearchTerm,
                                normalizedSearchTerm
                            })
                        .orderBy("LOWER(user.Name)", "ASC")
                        .getMany();

        // if email is null then the person making the request is a visitor
        if (!viewerIsVisitor) {
            me = await this._userRepository
                            .runCreateQueryBuilder()
                            .select("user")
                            .from(User, "user")
                            .innerJoinAndSelect("user.AccountSettings", "accountSettings")
                            .where("user.Email = :email", { email: request.MyEmail })
                            .getOne();
            fullViewingRights = me.AccountSettings.Role === UserRoleType.Admin || me.AccountSettings.Role === UserRoleType.SuperAdmin;
            selectedUsers     = selectedUsers.filter(u => u.AccountSettings.ProfileVisibility !== VisibilityType.Private || u.ID === me.ID);
        } else {
            selectedUsers = selectedUsers.filter(u => u.AccountSettings.ProfileVisibility === VisibilityType.Everyone);
        }

        const communityMembers  = selectedUsers.map(u => {
            const member        = new CommunityMemberDTO(u);
            member.ProfileImage = member.ProfileImage ? this._fileService.getSignedCloudFrontUrl(member.ProfileImage) : "";

            return member;
        });

        const response: GetCommunityLayersResponse = new GetCommunityLayersResponse();

        for (const skill of skills) {
            const skillCommunityMembers = communityMembers.filter(m => m.SkillIDs.indexOf(skill.ID) !== -1);

            if (skillCommunityMembers.length === 0) {
                continue;
            }

            if (skillCommunityMembers.length <= request.PageSize) {
                response.Layers.push(new CommunitySkillLayer(skill.ID, skillCommunityMembers, false));
            } else {
                response.Layers.push(new CommunitySkillLayer(skill.ID, skillCommunityMembers.slice(0, request.PageSize), true));
            }
        }

        return response;

    }

    public async getCommunityMembers(request: GetCommunityMembersRequest): Promise<GetCommunityMembersResponse> {

        let me: User;
        const viewerIsVisitor: boolean  = !request.MyEmail;
        const searchTerm: string        = request.SearchTerm.toLowerCase().replace(/\s\s+/g, " ").trim();
        const sortOrientation: string   = request.SortOrientation === SortOrientationType.ASC ? "ASC" : "DESC";

        const likeSearchTerm: string        = `%${searchTerm}%`;
        const normalizedSearchTerm: string  = searchTerm.replace(/\s/g, " & ");

        let selectedUsers: User[] = await this._userRepository
                        .runCreateQueryBuilder()
                        .select("user")
                        .from(User, "user")
                        .leftJoinAndSelect("user.ProfileImage", "profileImage")
                        .innerJoinAndSelect("user.Professional", "professional")
                        .innerJoinAndSelect("user.AccountSettings", "accountSettings")
                        .innerJoinAndSelect("professional.Skills", "skills")
                        .leftJoinAndSelect("user.SocialMedia", "socialMedia")
                        .where(
                            `accountSettings.AccountStatus <> :disabledStatus AND
                            (
                                (:searchTerm = '') IS NOT FALSE OR
                                LOWER(user.Name) like :likeSearchTerm OR
                                LOWER(user.Description) like :likeSearchTerm OR
                                (user.SearchTokens @@ to_tsquery(:normalizedSearchTerm)))`,
                            {
                                disabledStatus: UserAccountStatusType.Disabled,
                                searchTerm,
                                likeSearchTerm,
                                normalizedSearchTerm
                            })
                        .orderBy("LOWER(user.Name)", sortOrientation)
                        .getMany();

        // if email is null then the person making the request is a visitor
        if (!viewerIsVisitor) {
            me = await this._userRepository
                        .runCreateQueryBuilder()
                        .select("user")
                        .from(User, "user")
                        .innerJoinAndSelect("user.AccountSettings", "accountSettings")
                        .where("user.Email = :email", { email: request.MyEmail })
                        .getOne();

            selectedUsers = selectedUsers.filter(u => u.AccountSettings.ProfileVisibility !== VisibilityType.Private);
        } else {
            selectedUsers = selectedUsers.filter(u => u.AccountSettings.ProfileVisibility === VisibilityType.Everyone);
        }

        let communitySize: number       = 0;

        // filter users by skills
        if (request.SkillIDs.length !== 0) {
            selectedUsers = selectedUsers.filter(u => _.difference(request.SkillIDs, u.Professional.Skills.map(s => s.ID)).length === 0);
        }

        communitySize = selectedUsers.length;

        selectedUsers           = selectedUsers.splice(request.Page * request.PageSize, request.PageSize);

        const communityMembers  = selectedUsers.map(u => {
            const member        = new CommunityMemberDTO(u, true, request.IncludePersonalInformation);
            member.ProfileImage = member.ProfileImage ? this._fileService.getSignedCloudFrontUrl(member.ProfileImage) : "";

            return member;
        });

        return new GetCommunityMembersResponse (communityMembers, communitySize);
    }

    public async getRandomCommunityMembers(count: number = 5): Promise<CommunityMemberDTO[]> {
        const users: User[] = await this._userRepository
                            .runCreateQueryBuilder()
                            .select("user")
                            .from(User, "user")
                            .innerJoinAndSelect("user.AccountSettings", "accountSettings")
                            .innerJoinAndSelect("user.Professional", "professional")
                            .where("accountSettings.ProfileVisibility = :everyone", { everyone: VisibilityType.Everyone})
                            .orderBy("random()")
                            .limit(count)
                            .getMany();

        const communityMembers =  users.map(u => new CommunityMemberDTO(u));

        for (const member of communityMembers) {
            if (member.ProfileImage) {
                member.ProfileImage = member.ProfileImage ? this._fileService.getSignedCloudFrontUrl(member.ProfileImage) : "";
            }
        }

        return communityMembers;
    }

    public async getCommunityMemberProfile(email: string, communityMemberUsername: string): Promise<ProfileDTO> {
        let me: User;
        let fullViewingRights: boolean;
        const viewerIsVisitor: boolean = !email;
        let communityMember: User;

        try {
            await this._userRepository.getByUsername(communityMemberUsername).then(response => {
                if (!response) {
                    throw new Error(this._localizationService.getText("validation.user.non-existent-profile"));
                }

                communityMember = response;
            });
        } catch (error) {
            return undefined;
        }

        if (communityMember.ProfileImage) {
            communityMember.ProfileImage.Location           = this._fileService.getPresignedURL(communityMember.ProfileImage.Key);
            communityMember.ProfileImage.ThumbnailLocation  = this._fileService.getSignedCloudFrontUrl(communityMember.ProfileImage.ThumbnailLocation);
        }

        communityMember.PhotoGallery = communityMember.PhotoGallery.map(p => {

            return {
                ...p,
                Location: this._fileService.getPresignedURL(p.Key),
                ThumbnailLocation: this._fileService.getSignedCloudFrontUrl(p.ThumbnailLocation)
            };
        });

        const communityMemberProfileVisibility: VisibilityType      = communityMember.AccountSettings.ProfileVisibility;
        const communityMemberEmailVisibility: VisibilityType        = communityMember.AccountSettings.EmailVisibility;
        const communityMemberBirthDateVisibility: VisibilityType    = communityMember.AccountSettings.BirthDateVisibility;
        const communityMemberPhoneNumberVisibility: VisibilityType  = communityMember.AccountSettings.PhoneNumberVisibility;
        const communityMemberProfile: ProfileDTO                    = new ProfileDTO(communityMember, false, true);

        // if email is null then the person making the request is a visitor
        if (!viewerIsVisitor) {
            me                = await this._userRepository.getByEmail(email);
            fullViewingRights = me.AccountSettings.Role === UserRoleType.Admin || me.AccountSettings.Role === UserRoleType.SuperAdmin;
        }

        if (communityMember.AccountSettings.Role === UserRoleType.Admin && me.AccountSettings.Role !== UserRoleType.SuperAdmin) {
            return undefined;
        }

        if (fullViewingRights) {
            return communityMemberProfile;
        }

        if (communityMember.AccountSettings.AccountStatus === UserAccountStatusType.Disabled) {
            return undefined;
        }

        if ((communityMemberProfileVisibility === VisibilityType.Private) ||
                                                (communityMemberProfileVisibility === VisibilityType.Community && viewerIsVisitor)) {
            return undefined;
        }

        if ((communityMemberEmailVisibility === VisibilityType.Private) ||
                                                (communityMemberEmailVisibility === VisibilityType.Community && viewerIsVisitor)) {
            communityMemberProfile.Email = undefined;
        }

        if ((communityMemberBirthDateVisibility === VisibilityType.Private) ||
                                                (communityMemberBirthDateVisibility === VisibilityType.Community && viewerIsVisitor)) {
            communityMemberProfile.BirthDate = undefined;
        }

        if ((communityMemberPhoneNumberVisibility === VisibilityType.Private) ||
                                                (communityMemberPhoneNumberVisibility === VisibilityType.Community && viewerIsVisitor)) {
            communityMemberProfile.PhoneNumber = undefined;
        }

        communityMemberProfile.ProfileVisibility     = undefined;
        communityMemberProfile.EmailVisibility       = undefined;
        communityMemberProfile.BirthDateVisibility   = undefined;
        communityMemberProfile.PhoneNumberVisibility = undefined;

        communityMemberProfile.Projects = communityMemberProfile.Projects.map(p => ({
            ...p,
            Image: p.Image ? this._fileService.getSignedCloudFrontUrl(p.Image) : ""
        }));

        return communityMemberProfile;
    }

    public async getUsername (firstName: string, lastName: string): Promise<string> {
        const firstNameLower: string    = firstName.toLowerCase();
        const lastNameLower: string     = lastName.toLowerCase();

        const similarUsernames: User[] = await this._userRepository
                        .runCreateQueryBuilder()
                        .select("user")
                        .from(User, "user")
                        .innerJoinAndSelect("user.Professional", "professional")
                        .where("LOWER(professional.FirstName) = :firstName AND LOWER(professional.LastName) = :lastName", { firstName: firstNameLower, lastName: lastNameLower })
                        .getMany();
        const maximumUsernameID: number = similarUsernames.length !== 0 ?
                                                similarUsernames.map(u => +(u.Username.split(".").pop())).sort().pop() : 0;
        const username: string          = `${firstNameLower}.${lastNameLower}.${maximumUsernameID + 1}`;

        return username;
    }

    public async getVideoTitle (link: string): Promise<string> {
        let title: string = "";
        let videoID: string = "";

        if (Validators.isValidSocialMediaURL(link, SocialMediaCategoryType.Youtube)) {
            videoID                     = SocialMediaManager.extractYoutubeID(link);
            const youtubeURL: string    = config.youtube.videos_information_url
                                                .replace("{0}", videoID)
                                                .replace("{1}", config.youtube.api_key);
            const response              = await axios.get(youtubeURL);
            title                       = response.data && response.data.items.length !== 0 ?
                                            response.data.items[0].snippet.title : link;
        } else if (Validators.isValidSocialMediaURL(link, SocialMediaCategoryType.Vimeo)) {
            videoID                 = SocialMediaManager.extractVimeoID(link);
            const vimeoURL: string  = config.vimeo.videos_information_url
                                                .replace("{0}", videoID);
            const response          = await axios.get(vimeoURL);
            title                   = response.data && response.data.length !== 0 ?
                                        response.data[0].title : link;

        } else {
            title = link;
        }

        return title;
    }
}
