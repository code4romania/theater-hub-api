import { IBaseService }                                                    from "./IBaseService";
import { Award, Education, Experience, Skill, User, UserImage, UserVideo } from "../models";
import { FinishRegistrationResponseDTO, ProfileDTO,
        RegisterDTO, ResetPasswordRequestDTO, UpdateProfileSection }        from "../dtos";

export interface IUserService extends IBaseService<User> {

    getMe(email: string): Promise<ProfileDTO>;

    updateGeneralInformation(userEmail: string, generalInformationSection: ProfileDTO): Promise<void>;

    updateSkills(userEmail: string, skillsSection: UpdateProfileSection<Skill>): Promise<void>;

    updatePhotoGallery(userEmail: string, photoGallerySection: UpdateProfileSection<UserImage>): Promise<void>;

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

    createProfile(profile: ProfileDTO): Promise<void>;

    enableByID(id: string): Promise<User>;

    disableByID(id: string): Promise<User>;

}
