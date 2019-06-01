import { IBaseService }                                                    from "./IBaseService";
import { Award, Education, Experience, Skill, User, UserImage, UserVideo } from "../models";
import { ChangePasswordRequestDTO, ChangePasswordResponseDTO,
        CreateProfileResponseDTO,
        GenerateResumeRequestDTO,
        FinishRegistrationResponseDTO,
        GetCommunityLayersRequest, GetCommunityLayersResponse,
        GetCommunityMembersRequest, GetCommunityMembersResponse,
        ManagedUserRegistrationRequestDTO,
        ManagedUserRegistrationResponseDTO,
        MeDTO, ProfileDTO, RegisterDTO,
        ResetPasswordRequestDTO,
        SettingsDTO, UpdatePhotoGalleryResponse, UpdateProfileSection }    from "../dtos";
import { UserAccountProviderType }                                         from "../enums/UserAccountProviderType";

export interface IUserService extends IBaseService<User> {

    getMe(email: string): Promise<MeDTO>;

    getMyProfile(email: string): Promise<ProfileDTO>;

    deleteMe(email: string): Promise<ProfileDTO>;

    updateGeneralInformation(userEmail: string, generalInformationSection: ProfileDTO, profileImage: any): Promise<MeDTO>;

    updateSkills(userEmail: string, skillsSection: number[]): Promise<void>;

    updatePhotoGallery(userEmail: string, photoGallerySection: UserImage[], addedPhotos: any): Promise<UpdatePhotoGalleryResponse>;

    updateVideoGallery(userEmail: string, videoGallerySection: UpdateProfileSection<UserVideo>): Promise<void>;

    updateAwards(userEmail: string, awardsSection: UpdateProfileSection<Award>): Promise<void>;

    updateExperience(userEmail: string, experienceSection: UpdateProfileSection<Experience>): Promise<void>;

    updateEducation(userEmail: string, educationSection: UpdateProfileSection<Education>): Promise<void>;

    getByEmail(email: string): Promise<User>;

    register(register: RegisterDTO, accountProvider: UserAccountProviderType): Promise<User>;

    managedUserRegistration(request: ManagedUserRegistrationRequestDTO): Promise<ManagedUserRegistrationResponseDTO>;

    isValidRegistrationID(email: string, registrationID: string): Promise<boolean>;

    finishRegistration(email: string): Promise<FinishRegistrationResponseDTO>;

    forgotPassword(email: string): Promise<void>;

    isValidResetForgottenPasswordID(email: string, resetForgottenPasswordID: string): Promise<boolean>;

    resetPassword(resetPasswordRequest: ResetPasswordRequestDTO): Promise<void>;

    changePassword(email: string, changePasswordRequest: ChangePasswordRequestDTO): Promise<ChangePasswordResponseDTO>;

    createProfile(profile: ProfileDTO): Promise<CreateProfileResponseDTO>;

    generateResume(request: GenerateResumeRequestDTO): Promise<any>;

    getSettings(email: string): Promise<SettingsDTO>;

    updateSettings(email: string, settings: SettingsDTO): Promise<void>;

    getCommunityLayers(request: GetCommunityLayersRequest): Promise<GetCommunityLayersResponse>;

    getCommunityMembers(request: GetCommunityMembersRequest): Promise<GetCommunityMembersResponse>;

    getCommunityMemberProfile(email: string, communityMemberUsername: string): Promise<ProfileDTO>;

}
