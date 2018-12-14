import { inject, injectable }                  from "inversify";
import * as _                                  from "lodash";
import * as moment                             from "moment";
import { TYPES }                               from "../types";
import { IUserService, IEmailService,
                       ISkillService }         from "../services";
import { BaseService }                         from "./BaseService";
import { Award }                               from "../models/Award";
import { Education }                           from "../models/Education";
import { Experience }                          from "../models/Experience";
import { User }                                from "../models/User";
import { UserAccountSettings }                 from "../models/UserAccountSettings";
import { UserImage }                           from "../models/UserImage";
import { UserSocialMedia }                     from "../models/UserSocialMedia";
import { UserVideo }                           from "../models/UserVideo";
import { Professional }                        from "../models/Professional";
import { ProfessionalSkill }                   from "../models/ProfessionalSkill";
import { Skill }                               from "../models/Skill";
import { IAwardRepository,
    IEducationRepository,
    IEntityCategoryRepository,
    IExperienceRepository,
    IProfessionalSkillRepository,
    IUserAccountSettingsRepository,
    IUserImageRepository,
    IUserRepository,
    IUserSocialMediaRepository,
    IUserVideoRepository }                     from "../repositories";
import { CreateAccountEmailDTO,
    FinishRegistrationResponseDTO,
    ResetPasswordEmailDTO, ProfileDTO,
    RegisterDTO, ResetPasswordRequestDTO,
    UpdateProfileSection }                     from "../dtos";
import { EntityCategoryType }                  from "../enums/EntityCategoryType";
import { ProfileSectionType }                  from "../enums/ProfileSectionType";
import { SocialMediaCategoryType }             from "../enums/SocialMediaCategoryType";
import { UserAccountStatusType }               from "../enums/UserAccountStatusType";
import { UserRoleType }                        from "../enums/UserRoleType";
import { VisibilityType }                      from "../enums/VisibilityType";
const bcrypt                                   = require("bcrypt");
const config                                   = require("../config/env").getConfig();
const jwt                                      = require("jsonwebtoken");
const uuidv4                                   = require("uuid/v4");

@injectable()
export class UserService extends BaseService<User> implements IUserService {

    private readonly _awardRepository: IAwardRepository;
    private readonly _educationRepository: IEducationRepository;
    private readonly _entityCategoryRepository: IEntityCategoryRepository;
    private readonly _experienceRepository: IExperienceRepository;
    private readonly _professionalSkillRepository: IProfessionalSkillRepository;
    private readonly _userAccountSettingsRepository: IUserAccountSettingsRepository;
    private readonly _userImageRepository: IUserImageRepository;
    private readonly _userRepository: IUserRepository;
    private readonly _userSocialMediaRepository: IUserSocialMediaRepository;
    private readonly _userVideoRepository: IUserVideoRepository;
    private readonly _skillService: ISkillService;
    private readonly _emailService: IEmailService;

    constructor(
        @inject(TYPES.AwardRepository) awardRepository: IAwardRepository,
        @inject(TYPES.EducationRepository) educationRepository: IEducationRepository,
        @inject(TYPES.EntityCategoryRepository) entityCategoryRepository: IEntityCategoryRepository,
        @inject(TYPES.ExperienceRepository) experienceRepository: IExperienceRepository,
        @inject(TYPES.ProfessionalSkillRepository) professionalSkillRepository: IProfessionalSkillRepository,
        @inject(TYPES.UserAccountSettingsRepository) userAccountSettingsRepository: IUserAccountSettingsRepository,
        @inject(TYPES.UserImageRepository) userImageRepository: IUserImageRepository,
        @inject(TYPES.UserRepository) userRepository: IUserRepository,
        @inject(TYPES.UserSocialMediaRepository) userSocialMediaRepository: IUserSocialMediaRepository,
        @inject(TYPES.UserVideoRepository)  userVideoRepository: IUserVideoRepository,
        @inject(TYPES.SkillService) skillService: ISkillService,
        @inject(TYPES.EmailService) emailService: IEmailService
    ) {
        super(userRepository);
        this._awardRepository                 = awardRepository;
        this._educationRepository             = educationRepository;
        this._entityCategoryRepository        = entityCategoryRepository;
        this._experienceRepository            = experienceRepository;
        this._professionalSkillRepository     = professionalSkillRepository;
        this._userAccountSettingsRepository   = userAccountSettingsRepository;
        this._userImageRepository             = userImageRepository;
        this._userRepository                  = userRepository;
        this._userSocialMediaRepository       = userSocialMediaRepository;
        this._userVideoRepository             = userVideoRepository;
        this._skillService                    = skillService;
        this._emailService                    = emailService;
    }

    public async deleteByID(id: string): Promise<User> {

        return this._userRepository
                .runCreateQueryBuilder()
                .delete()
                .from(User)
                .where("ID = :id", { id })
                .execute();
    }

    public async getMe(email: string): Promise<ProfileDTO> {
        const user: User = await this.getByEmail(email);

        return new ProfileDTO(user);
    }

    public async updateGeneralInformation(userEmail: string, generalInformationSection: ProfileDTO): Promise<void> {
        const dbUser = await this.getByEmail(userEmail);

        dbUser.Professional.FirstName = generalInformationSection.FirstName;
        dbUser.Professional.LastName  = generalInformationSection.LastName;
        dbUser.Name                   = `${generalInformationSection.FirstName} ${generalInformationSection.LastName}`;

        if (generalInformationSection.ProfileImage && !dbUser.ProfileImage) {

            const profileImage: UserImage = {
                Image: generalInformationSection.ProfileImage.Image,
                IsProfileImage: true
            } as UserImage;

            dbUser.ProfileImage = profileImage;
        } else if (generalInformationSection.ProfileImage) {
            dbUser.ProfileImage.Image = generalInformationSection.ProfileImage.Image;
        } else {
            this._userImageRepository.deleteByID(dbUser.ProfileImage.ID);
        }

        dbUser.BirthDate       = generalInformationSection.BirthDate;
        dbUser.PhoneNumber     = generalInformationSection.PhoneNumber;
        dbUser.Description     = generalInformationSection.Description;
        dbUser.Website         = generalInformationSection.Website;

        const facebookSocialMedia     = dbUser.SocialMedia.find(s => s.SocialMediaCategoryID === SocialMediaCategoryType.Facebook);
        const instagramSocialMedia    = dbUser.SocialMedia.find(s => s.SocialMediaCategoryID === SocialMediaCategoryType.Instagram);
        const linkedinSocialMedia     = dbUser.SocialMedia.find(s => s.SocialMediaCategoryID === SocialMediaCategoryType.Linkedin);
        const youtubeSocialMedia      = dbUser.SocialMedia.find(s => s.SocialMediaCategoryID === SocialMediaCategoryType.Youtube);

        if (generalInformationSection.FacebookLink && !facebookSocialMedia) {
            dbUser.SocialMedia.push({
                Link: generalInformationSection.FacebookLink,
                User: dbUser,
                SocialMediaCategoryID: SocialMediaCategoryType.Facebook
            } as UserSocialMedia);
        } else if (generalInformationSection.FacebookLink) {
            facebookSocialMedia.Link = generalInformationSection.FacebookLink;
        }

        if (generalInformationSection.InstagramLink && !instagramSocialMedia) {
            dbUser.SocialMedia.push({
                Link: generalInformationSection.InstagramLink,
                User: dbUser,
                SocialMediaCategoryID: SocialMediaCategoryType.Instagram
            } as UserSocialMedia);
        } else if (generalInformationSection.InstagramLink) {
            instagramSocialMedia.Link = generalInformationSection.InstagramLink;
        }

        if (generalInformationSection.LinkedinLink && !linkedinSocialMedia) {
            dbUser.SocialMedia.push({
                Link: generalInformationSection.LinkedinLink,
                User: dbUser,
                SocialMediaCategoryID: SocialMediaCategoryType.Linkedin
            } as UserSocialMedia);
        } else if (generalInformationSection.LinkedinLink) {
            linkedinSocialMedia.Link = generalInformationSection.LinkedinLink;
        }

        if (generalInformationSection.YoutubeLink && !youtubeSocialMedia) {
            dbUser.SocialMedia.push({
                Link: generalInformationSection.YoutubeLink,
                User: dbUser,
                SocialMediaCategoryID: SocialMediaCategoryType.Youtube
            } as UserSocialMedia);
        } else if (generalInformationSection.YoutubeLink) {
            youtubeSocialMedia.Link = generalInformationSection.YoutubeLink;
        }

        this.update(dbUser);
    }

    public async updateSkills(userEmail: string, skillsSection: UpdateProfileSection<Skill>): Promise<void> {
        const dbUser                         = await this.getByEmail(userEmail);
        const dbSkillsIDs: number[]          = dbUser.Professional.Skills.map(s => s.SkillID);
        const addedEntitiesIDs: number[]     = skillsSection.AddedEntities ?
                                                skillsSection.AddedEntities.map(e => e.ID).filter(id => dbSkillsIDs.indexOf(id) === -1) :
                                                [];
        const removedEntitiesIDs: number[]   = skillsSection.RemovedEntities ?
                                                skillsSection.RemovedEntities.map(id => +id).filter(id => dbSkillsIDs.indexOf(id) !== -1) :
                                                [];
        const resultingSkillIDs: number[]    = _.union(dbSkillsIDs, addedEntitiesIDs).filter(id => removedEntitiesIDs.indexOf(id) === -1);

        if (resultingSkillIDs.length === 0) {
            throw new Error("Select at least one skill");
        }

        addedEntitiesIDs.forEach(id => {
            const professionalSkill: ProfessionalSkill = {
                ProfessionalID: dbUser.Professional.ID,
                SkillID: id
            } as ProfessionalSkill;

            this._professionalSkillRepository.insert(professionalSkill);
        });

        removedEntitiesIDs.forEach(id => {
            this._professionalSkillRepository.delete(dbUser.Professional.Skills.find(ps => ps.SkillID === id));
        });

    }

    public async updatePhotoGallery(userEmail: string, photoGallerySection: UpdateProfileSection<UserImage>): Promise<void> {
        const dbUser                       = await this.getByEmail(userEmail);
        const dbPhotoGalleryIDs: string[]  = dbUser.PhotoGallery.map(p => p.ID);
        const addedEntities: UserImage[]   = photoGallerySection.AddedEntities ? photoGallerySection.AddedEntities : [];
        const removedEntitiesIDs: string[] = photoGallerySection.RemovedEntities ?
                                photoGallerySection.RemovedEntities.filter(id => dbPhotoGalleryIDs.indexOf(id) !== -1) :
                                [];

        addedEntities.forEach(p => {
            const photo: UserImage = {
                Image: p.Image,
                User: dbUser,
                IsProfileImage: false
            } as UserImage;

            this._userImageRepository.insert(photo);
        });

        removedEntitiesIDs.forEach(id => {
            this._userImageRepository.deleteByID(id);
        });
    }

    public async updateVideoGallery(userEmail: string, videoGallerySection: UpdateProfileSection<UserVideo>): Promise<void> {
        const dbUser                       = await this.getByEmail(userEmail);
        const dbVideoGalleryIDs: string[]  = dbUser.VideoGallery.map(p => p.ID);
        const addedEntities: UserVideo[]   = videoGallerySection.AddedEntities ? videoGallerySection.AddedEntities : [];
        const removedEntitiesIDs: string[] = videoGallerySection.RemovedEntities ?
                                    videoGallerySection.RemovedEntities.filter(id => dbVideoGalleryIDs.indexOf(id) !== -1) :
                                    [];
        const updatedEntities: UserVideo[] = videoGallerySection.UpdatedEntities ? videoGallerySection.UpdatedEntities : [];

        addedEntities.forEach(v => {
            const video: UserVideo = {
                Video: v.Video,
                User: dbUser
            } as UserVideo;

            this._userVideoRepository.insert(video);
        });

        for (const entity of updatedEntities) {
            const dbUserVideo = await this._userVideoRepository.getByID(entity.ID);

            dbUserVideo.Video = entity.Video;

            this._userVideoRepository.update(dbUserVideo);
        }

        removedEntitiesIDs.forEach(id => {
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

        addedEntities.forEach(a => {
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

        removedEntitiesIDs.forEach(id => {
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

        addedEntities.forEach(e => {
            const experience: Experience = {
                Position: e.Position,
                Employer: e.Employer,
                Description: e.Description,
                StartDate: e.StartDate,
                EndDate: e.EndDate
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

        experienceSection.RemovedEntities.forEach(id => {
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

        addedEntities.forEach(e => {
            const education: Education = {
                Title: e.Title,
                Institution: e.Institution,
                Description: e.Description,
                StartDate: e.StartDate,
                EndDate: e.EndDate
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

        removedEntitiesIDs.forEach(id => {
            this._educationRepository.deleteByID(id);
        });
    }

    public async getByEmail(email: string): Promise<User> {
        return this._userRepository.getByEmail(email);
    }

    public async register(register: RegisterDTO): Promise<User> {

        const saltRounds: number = 10;

        // TODO: refactor to make hashing the password async
        const passwordSalt           = bcrypt.genSaltSync(saltRounds);
        const passwordHash           = bcrypt.hashSync(register.Password, passwordSalt);
        const registrationID: string = uuidv4();
        const registrationIDSalt     = bcrypt.genSaltSync(saltRounds);
        const registrationIDHash     = bcrypt.hashSync(registrationID, registrationIDSalt);

        const user: User = {
            Email:              register.Email,
            Name:               `${register.FirstName} ${register.LastName}`,
            PasswordHash:       passwordHash
        } as User;

        user.AccountSettings = {
            RegistrationIDHash:     registrationIDHash,
            EntityCategory:         EntityCategoryType.Professional,
            AccountStatus:          UserAccountStatusType.Registered,
            Role:                   UserRoleType.User,
            ProfileVisibility:      VisibilityType.Everyone,
            EmailVisibility:        VisibilityType.Everyone,
            BirthDateVisibility:    VisibilityType.Everyone,
            PhoneNumberVisibility:  VisibilityType.Everyone
        } as UserAccountSettings;

        user.Professional  = {
            FirstName: register.FirstName,
            LastName:  register.LastName
        } as Professional;

        const createAccountEmailDTO: CreateAccountEmailDTO = {
              UserEmaiAddress:      register.Email,
              UserFullName:         `${register.FirstName} ${register.LastName}`,
              UserRegistrationID:   registrationID
        } as CreateAccountEmailDTO;

        this._emailService.sendCreateAccountEmail(createAccountEmailDTO);

        return this.create(user);
    }

    public async isValidRegistrationID(email: string, registrationID: string): Promise<boolean> {

        const dbUser: User = await this._userRepository.getByEmail(email);

        // if (!dbUser || dbUser.AccountSettings.AccountStatus !== UserAccountStatusType.Registered) {
        //     return false;
        // }

        const isRegistrationIDCorrect = bcrypt.compareSync(registrationID, dbUser.AccountSettings.RegistrationIDHash);

        return isRegistrationIDCorrect;
    }

    public async finishRegistration(email: string): Promise<FinishRegistrationResponseDTO> {

        const dbUser: User                  = await this._userRepository.getByEmail(email);

        const dbUserAccountSettings         = await this._userAccountSettingsRepository.getByID(dbUser.AccountSettings.ID);
        dbUserAccountSettings.AccountStatus = UserAccountStatusType.Confirmed;
        this._userAccountSettingsRepository.update(dbUserAccountSettings);

        const response: FinishRegistrationResponseDTO = {
            Token: jwt.sign({
                firstName: dbUser.Professional.FirstName,
                lastName: dbUser.Professional.LastName,
                email,
                role: dbUserAccountSettings.Role,
                accountStatus: dbUser.AccountSettings.AccountStatus
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

    public async resetPassword(resetPasswordRequest: ResetPasswordRequestDTO): Promise<void> {

        const dbUser: User       = await this._userRepository.getByEmail(resetPasswordRequest.Email);
        const saltRounds: number = 10;
        const passwordSalt       = bcrypt.genSaltSync(saltRounds);
        dbUser.PasswordHash      = bcrypt.hashSync(resetPasswordRequest.Password, passwordSalt);

        this.update(dbUser);
    }

    public async createProfile(profile: ProfileDTO): Promise<void> {

        const user: User = await this._userRepository.getByEmail(profile.Email);

        if (user.AccountSettings.AccountStatus !== UserAccountStatusType.Registered) {
            return;
        }

        // General Information

        const profileImage: UserImage = {
            Image: profile.ProfileImage.Image,
            IsProfileImage: true
        } as UserImage;
        user.ProfileImage = profileImage;

        user.BirthDate     = profile.BirthDate;
        user.PhoneNumber   = profile.PhoneNumber;
        user.Website       = profile.Website;
        user.Description   = profile.Description;

        // Skills
        if (profile.Skills) {
            const skills: Skill[] = await this._skillService.getByIDs(profile.Skills);

            skills.forEach(s => {
                const professionalSkill: ProfessionalSkill = {
                    ProfessionalID: user.Professional.ID,
                    SkillID: s.ID
                } as ProfessionalSkill;

                user.Professional.Skills.push(professionalSkill);
            });
        }

        // Portfolio

        if (profile.PhotoGallery) {

            profile.PhotoGallery.forEach(p => {
                const photo: UserImage = {
                    Image: p.Image,
                    User: user,
                    IsProfileImage: false
                } as UserImage;

                user.PhotoGallery.push(photo);
            });
        }

        if (profile.VideoGallery) {

            profile.VideoGallery.forEach(v => {
                const video: UserVideo = {
                    Video: v.Video,
                    User: user
                } as UserVideo;

                user.VideoGallery.push(video);
            });
        }

        // Awards

        if (profile.Awards) {

            profile.Awards.forEach(a => {
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

            profile.Experience.forEach(e => {
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

            profile.Education.forEach(e => {
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

        // Security

        user.AccountSettings.ProfileVisibility       = profile.ProfileVisibility;
        user.AccountSettings.EmailVisibility         = profile.EmailVisibility;
        user.AccountSettings.BirthDateVisibility     = profile.BirthDateVisibility;
        user.AccountSettings.PhoneNumberVisibility   = profile.PhoneNumberVisibility;

        user.AccountSettings.AccountStatus  = UserAccountStatusType.Enabled;

        this.update(user);
    }

    public async enableByID(id: string): Promise<User> {
        const user: User = await this._userRepository.getByID(id);

        if (user.AccountSettings.AccountStatus === UserAccountStatusType.Enabled) {
            return user;
        }

        user.AccountSettings.AccountStatus = UserAccountStatusType.Enabled;

        return this.update(user);
    }

    public async disableByID(id: string): Promise<User> {
        const user: User = await this._userRepository.getByID(id);

        if (user.AccountSettings.AccountStatus === UserAccountStatusType.Disabled) {
            return user;
        }

        user.AccountSettings.AccountStatus = UserAccountStatusType.Disabled;

        return this.update(user);
    }

}
