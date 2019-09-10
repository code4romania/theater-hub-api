import { Request, Response }     from "express";
const multer                     = require("multer");
import { container }             from "../config/inversify.config";
import { TYPES }                 from "../types/custom-types";
import { IUsersController,
    IUserRoutesValidators }      from "../contracts";
import { validatorMiddleware,
     authorizationMiddleware,
     getPrincipalIfRequestHasToken }   from "../middlewares";

export default (app: any) => {

    const usersController: IUsersController           = container.get<IUsersController>(TYPES.UsersController);
    const userRoutesValidators: IUserRoutesValidators = container.get<IUserRoutesValidators>(TYPES.UserRoutesValidators);

    const storage   = multer.memoryStorage();
    const upload    = multer({ storage: storage });

    app.get("/api", (req: Request, res: Response) => res.status(200).send({
        message: "Welcome to the Theater HUB API!",
    }));

    app.get("/api/users/me",                authorizationMiddleware, (req: Request, res: Response) => usersController.getMe(req, res));

    app.get("/api/users/me/profile",        authorizationMiddleware, (req: Request, res: Response) => usersController.getMyProfile(req, res));

    app.delete("/api/users/me",             authorizationMiddleware, (req: Request, res: Response) => usersController.deleteMe(req, res));

    app.post("/api/users/contact",          userRoutesValidators.getContactValidators(), validatorMiddleware,
                                            (req: Request, res: Response) => usersController.contact(req, res));

    app.post("/api/users/register",         userRoutesValidators.getRegisterValidators(), validatorMiddleware,
                                            (req: Request, res: Response) => usersController.register(req, res));

    app.post("/api/users/register/managed", userRoutesValidators.getManagedUserRegisterValidators(), validatorMiddleware,
                                              (req: Request, res: Response) => usersController.managedUserRegister(req, res));

    app.post("/api/users/register/finish", userRoutesValidators.getFinishRegistrationValidators(), validatorMiddleware,
                                              (req: Request, res: Response) => usersController.finishRegistration(req, res));

    app.post("/api/users/password/forgot", userRoutesValidators.getForgotPasswordValidators(), validatorMiddleware,
                                              (req: Request, res: Response) => usersController.forgotPassword(req, res));

    app.post("/api/users/password/reset", userRoutesValidators.getResetPasswordValidators(), validatorMiddleware,
                                              (req: Request, res: Response) => usersController.resetPassword(req, res));

    app.post("/api/users/password/change", authorizationMiddleware, userRoutesValidators.getChangePasswordValidators(), validatorMiddleware,
                                              (req: Request, res: Response) => usersController.changePassword(req, res));

    app.post("/api/users/profile/create", authorizationMiddleware,
                                          upload.fields([{name: "ProfileImage", maxCount: 1}, {name: "AddedPhotos", maxCount: 10}]),
                                          userRoutesValidators.getCreateProfileValidators(),
                                          validatorMiddleware,
                                          (req: Request, res: Response) => usersController.createProfile(req, res));

    app.post("/api/users/me/general",   authorizationMiddleware,
                                        upload.single("ProfileImage"),
                                        userRoutesValidators.getGeneralInformationValidators(), validatorMiddleware,
                                        (req: Request, res: Response) => usersController.updateMyGeneralInformation(req, res));

    app.post("/api/users/me/skills",    authorizationMiddleware, userRoutesValidators.getSkillsValidators(), validatorMiddleware,
                                        (req: Request, res: Response) => usersController.updateMySkills(req, res));

    app.post("/api/users/me/photogallery",  authorizationMiddleware,
                                            upload.array("AddedPhotos", 10),
                                            (req: Request, res: Response) => usersController.updateMyPhotoGallery(req, res));

    app.post("/api/users/me/videogallery",  authorizationMiddleware, userRoutesValidators.getVideoGalleryValidators(), validatorMiddleware,
                                            (req: Request, res: Response) => usersController.updateMyVideoGallery(req, res));

    app.post("/api/users/me/awards",    authorizationMiddleware, userRoutesValidators.getAwardsValidators(), validatorMiddleware,
                                        (req: Request, res: Response) => usersController.updateMyAwards(req, res));

    app.post("/api/users/me/experience",    authorizationMiddleware, userRoutesValidators.getExperienceValidators(), validatorMiddleware,
                                            (req: Request, res: Response) => usersController.updateMyExperience(req, res));

    app.post("/api/users/me/education", authorizationMiddleware, userRoutesValidators.getEducationValidators(), validatorMiddleware,
                                        (req: Request, res: Response) => usersController.updateMyEducation(req, res));

    app.get("/api/users/me/projects", authorizationMiddleware,
                                    (req: Request, res: Response) => usersController.getMyProjects(req, res));

    app.get("/api/users/resume", authorizationMiddleware, (req: Request, res: Response) => usersController.generateResume(req, res));

    app.get("/api/users/settings",     authorizationMiddleware, (req: Request, res: Response) => usersController.getSettings(req, res));

    app.patch("/api/users/settings",   authorizationMiddleware, (req: Request, res: Response) => usersController.updateSettings(req, res));

    app.get("/api/users/community/layers",  getPrincipalIfRequestHasToken,
                                            (req: Request, res: Response) => usersController.getCommunityLayers(req, res));

    app.get("/api/users/community/members", getPrincipalIfRequestHasToken,
                                            (req: Request, res: Response) => usersController.getCommunityMembers(req, res));

    app.get("/api/users/profile/:username", getPrincipalIfRequestHasToken,
                                            (req: Request, res: Response) => usersController.getCommunityMemberProfile(req, res));

    app.post("/api/users",                    (req: Request, res: Response) => usersController.create(req, res));

    app.get("/api/users", authorizationMiddleware, (req: Request, res: Response) => usersController.getAll(req, res));

    app.get("/api/users/:userID",             (req: Request, res: Response) => usersController.getByID(req, res));

    app.patch("/api/users/:userID",           (req: Request, res: Response) => usersController.update(req, res));

};
