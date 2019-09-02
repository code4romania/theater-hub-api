import { Request, Response }    from "express";
import { IBaseApiController }   from "./IBaseApiController";

export interface IUsersController extends IBaseApiController {

    getMe(req: Request, res: Response): Promise<void>;

    getMyProfile(req: Request, res: Response): Promise<void>;

    deleteMe(req: Request, res: Response): Promise<void>;

    updateMyGeneralInformation(req: Request, res: Response): Promise<void>;

    updateMySkills(req: Request, res: Response): Promise<void>;

    updateMyPhotoGallery(req: Request, res: Response): Promise<void>;

    updateMyVideoGallery(req: Request, res: Response): Promise<void>;

    updateMyAwards(req: Request, res: Response): Promise<void>;

    updateMyExperience(req: Request, res: Response): Promise<void>;

    updateMyEducation(req: Request, res: Response): Promise<void>;

    contact(req: Request, res: Response): Promise<void>;

    register(req: Request, res: Response): Promise<void>;

    managedUserRegister(req: Request, res: Response): Promise<void>;

    finishRegistration(req: Request, res: Response): Promise<void>;

    forgotPassword(req: Request, res: Response): Promise<void>;

    resetPassword(req: Request, res: Response): Promise<void>;

    changePassword(req: Request, res: Response): Promise<void>;

    createProfile(req: Request, res: Response): Promise<void>;

    generateResume(req: Request, res: Response): Promise<void>;

    getSettings(req: Request, res: Response): Promise<void>;

    updateSettings(req: Request, res: Response): Promise<void>;

    getCommunityLayers(req: Request, res: Response): Promise<void>;

    getCommunityMembers(req: Request, res: Response): Promise<void>;

    getCommunityMemberProfile(req: Request, res: Response): Promise<void>;

}
