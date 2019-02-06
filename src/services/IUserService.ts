import { IBaseService }                                                    from "./IBaseService";
import { Award, Education, Experience, Skill, User, UserImage, UserVideo } from "../models";
import { ChangePasswordRequestDTO, ChangePasswordResponseDTO,
        CreateProfileResponseDTO,
        FinishRegistrationResponseDTO,
        GetCommunityMembersRequest, GetCommunityResponse,
        MeDTO, ProfileDTO, RegisterDTO,
        ResetPasswordRequestDTO, SetPasswordRequestDTO,
        SettingsDTO, UpdateProfileSection }                                 from "../dtos";

export interface IUserService extends IBaseService<User> {

    getMe(email: string): Promise<MeDTO>;

    getMyProfile(email: string): Promise<ProfileDTO>;

    deleteMe(email: string): Promise<ProfileDTO>;

    updateGeneralInformation(userEmail: string, generalInformationSection: ProfileDTO): Promise<MeDTO>;

    updateSkills(userEmail: string, skillsSection: number[]): Promise<void>;

    updatePhotoGallery(userEmail: string, photoGallerySection: UserImage[]): Promise<void>;

    updateVideoGallery(userEmail: string, videoGallerySection: UpdateProfileSection<UserVideo>): Promise<void>;

    updateAwards(userEmail: string, awardsSection: UpdateProfileSection<Award>): Promise<void>;

    updateExperience(userEmail: string, experienceSection: UpdateProfileSection<Experience>): Promise<void>;

    updateEducation(userEmail: string, educationSection: UpdateProfileSection<Education>): Promise<void>;

    getByEmail(email: string): Promise<User>;

    register(register: RegisterDTO): Promise<User>;

    isValidRegistrationID(email: string, registrationID: string): Promise<boolean>;

    finishRegistration(email: string): Promise<FinishRegistrationResponseDTO>;

    forgotPassword(email: string): Promise<void>;

    isValidResetForgottenPasswordID(email: string, resetForgottenPasswordID: string): Promise<boolean>;

    resetPassword(resetPasswordRequest: ResetPasswordRequestDTO): Promise<void>;

    setPassword(setPasswordRequestDTO: SetPasswordRequestDTO): Promise<void>;

    changePassword(email: string, changePasswordRequest: ChangePasswordRequestDTO): Promise<ChangePasswordResponseDTO>;

    createProfile(profile: ProfileDTO): Promise<CreateProfileResponseDTO>;

    getSettings(email: string): Promise<SettingsDTO>;

    updateSettings(email: string, settings: SettingsDTO): Promise<void>;

    getCommunityMembers(request: GetCommunityMembersRequest): Promise<GetCommunityResponse>;

    getCommunityMemberProfile(email: string, communityMemberID: string): Promise<ProfileDTO>;

}
