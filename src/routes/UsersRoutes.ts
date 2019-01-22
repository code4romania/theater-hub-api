import { container }             from "../config/inversify.config";
import { TYPES }                 from "../types/custom-types";
import { IUsersController }      from "../controllers";
import { UserRoleType }          from "../enums";
import { IUserRoutesValidators } from "../validators";
import { validatorMiddleware,
     authorizationMiddleware,
     getPrincipalIfRequestHasToken,
     checkUserRoleMiddleware }  from "../middlewares";
import { Request, Response }     from "express";

export default (app: any) => {

    const usersController: IUsersController           = container.get<IUsersController>(TYPES.UsersController);
    const userRoutesValidators: IUserRoutesValidators = container.get<IUserRoutesValidators>(TYPES.UserRoutesValidators);

    app.get("/api", (req: Request, res: Response) => res.status(200).send({
        message: "Welcome to the Theater HUB API!",
    }));

    app.get("/api/users/me",                authorizationMiddleware, (req: Request, res: Response) => usersController.getMe(req, res));

    app.get("/api/users/me/profile",        authorizationMiddleware, (req: Request, res: Response) => usersController.getMyProfile(req, res));

    app.delete("/api/users/me",             authorizationMiddleware, (req: Request, res: Response) => usersController.deleteMe(req, res));

    app.post("/api/users/register",         userRoutesValidators.getRegisterValidators(), validatorMiddleware,
                                              (req: Request, res: Response) => usersController.register(req, res));

    app.post("/api/users/register/finish", userRoutesValidators.getFinishRegistrationValidators(), validatorMiddleware,
                                              (req: Request, res: Response) => usersController.finishRegistration(req, res));

    app.post("/api/users/password/forgot", userRoutesValidators.getForgotPasswordValidators(), validatorMiddleware,
                                              (req: Request, res: Response) => usersController.forgotPassword(req, res));

    app.post("/api/users/password/reset", userRoutesValidators.getResetPasswordValidators(), validatorMiddleware,
                                              (req: Request, res: Response) => usersController.resetPassword(req, res));

    app.post("/api/users/password/change", authorizationMiddleware, userRoutesValidators.getChangePasswordValidators(), validatorMiddleware,
                                              (req: Request, res: Response) => usersController.changePassword(req, res));

    app.post("/api/users/profile/create", authorizationMiddleware, userRoutesValidators.getCreateProfile(), validatorMiddleware,
                                              (req: Request, res: Response) => usersController.createProfile(req, res));

    app.post("/api/users/me/general", authorizationMiddleware, userRoutesValidators.getGeneralInformationValidators(), validatorMiddleware,
                                                    (req: Request, res: Response) => usersController.updateMyGeneralInformation(req, res));

    app.post("/api/users/me/skills", authorizationMiddleware, userRoutesValidators.getSkillsValidators(), validatorMiddleware,
                                                    (req: Request, res: Response) => usersController.updateMySkills(req, res));

    app.post("/api/users/me/photogallery", authorizationMiddleware,
                                                    (req: Request, res: Response) => usersController.updateMyPhotoGallery(req, res));

    app.post("/api/users/me/videogallery", authorizationMiddleware, userRoutesValidators.getVideoGalleryValidators(), validatorMiddleware,
                                                    (req: Request, res: Response) => usersController.updateMyVideoGallery(req, res));

    app.post("/api/users/me/awards", authorizationMiddleware, userRoutesValidators.getAwardsValidators(), validatorMiddleware,
                                                    (req: Request, res: Response) => usersController.updateMyAwards(req, res));

    app.post("/api/users/me/experience", authorizationMiddleware, userRoutesValidators.getExperienceValidators(), validatorMiddleware,
                                                    (req: Request, res: Response) => usersController.updateMyExperience(req, res));

    app.post("/api/users/me/education", authorizationMiddleware, userRoutesValidators.getEducationValidators(), validatorMiddleware,
                                                    (req: Request, res: Response) => usersController.updateMyEducation(req, res));

    app.post("/api/users/resume",             (req: Request, res: Response) => usersController.generateResume(req, res));

    app.get("/api/users/settings",     authorizationMiddleware, (req: Request, res: Response) => usersController.getSettings(req, res));

    app.patch("/api/users/settings",   authorizationMiddleware, (req: Request, res: Response) => usersController.updateSettings(req, res));

    app.get("/api/users/community", getPrincipalIfRequestHasToken,
                                             (req: Request, res: Response) => usersController.getCommunityMembers(req, res));

    app.get("/api/users/profile/:userID", getPrincipalIfRequestHasToken,
                                              (req: Request, res: Response) => usersController.getCommunityMemberProfile(req, res));

    app.post("/api/users",                    (req: Request, res: Response) => usersController.create(req, res));

    app.get("/api/users", authorizationMiddleware, (req: Request, res: Response) => usersController.getAll(req, res));

    app.get("/api/users/:userID",             (req: Request, res: Response) => usersController.getByID(req, res));

    app.patch("/api/users/:userID",           (req: Request, res: Response) => usersController.update(req, res));

    app.delete("/api/users/:userID",          (req: Request, res: Response) => usersController.delete(req, res));

    app.patch("/api/users/enable/:userID", authorizationMiddleware, checkUserRoleMiddleware(UserRoleType.Admin),
                                                                (req: Request, res: Response) => usersController.enable(req, res));

    app.patch("/api/users/disable/:userID", authorizationMiddleware, checkUserRoleMiddleware(UserRoleType.Admin),
                                                                (req: Request, res: Response) => usersController.disable(req, res));

};
