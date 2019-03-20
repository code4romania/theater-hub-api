
export interface IUserRoutesValidators {

    getRegisterValidators(req: any): any;

    getManagedUserRegisterValidators(): any;

    getFinishRegistrationValidators(): any;

    getForgotPasswordValidators(): any;

    getResetPasswordValidators(): any;

    getChangePasswordValidators(): any;

    getCreateProfile(): any;

    getGeneralInformationValidators(): any;

    getSkillsValidators(): any;

    getVideoGalleryValidators(): any;

    getAwardsValidators(): any;

    getExperienceValidators(): any;

    getEducationValidators(): any;

}
