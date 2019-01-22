import { inject, injectable }          from "inversify";
import { Request, Response }           from "express";
import chalk                           from "chalk";
import * as uuid                       from "uuid/v4";
import { Application }                 from "express";
import { TYPES }                       from "../types";
import { User }                        from "../models/User";
import { IUsersController }            from "./IUsersController";
import { BaseApiController }           from "./BaseApiController";
import { IUserService, IEmailService } from "../services";
import { UserRoleType }                from "../enums";
import { Validators }                  from "../utils";
import { ChangePasswordRequestDTO,
   ChangePasswordResponseDTO,
   CreateProfileResponseDTO,
   FinishRegistrationRequestDTO,
   FinishRegistrationResponseDTO,
   GetCommunityMembersRequest,
   GetCommunityResponse,
   MeDTO, ProfileDTO, RegisterDTO,
   ResetPasswordRequestDTO,
   SettingsDTO,
   UpdateProfileSection }              from "../dtos";
import { Award, Education,
  Experience, Skill,
  UserImage, UserVideo }               from "../models";
const fs                               = require("fs");
const path                             = require("path");
const pdf                              = require("html-pdf");

@injectable()
export class UsersController extends BaseApiController<User> implements IUsersController {

  private readonly _userService: IUserService;
  private readonly _emailService: IEmailService;

  constructor(@inject(TYPES.UserService) userService: IUserService, @inject(TYPES.EmailService) emailService: IEmailService) {
    super(userService);
    this._userService  = userService;
    this._emailService = emailService;
  }

  public async getMe(request: Request, response: Response): Promise<void> {
    const me: MeDTO = await this._userService.getMe(request.Principal.Email);

    response.send(me);
  }

  public async getMyProfile(request: Request, response: Response): Promise<void> {
    const profile: ProfileDTO = await this._userService.getMyProfile(request.Principal.Email);

    response.send(profile);
  }

  public async getCommunityMembers(request: Request, response: Response): Promise<void> {
    const myEmail: string           = request.Principal ? request.Principal.Email : "";
    const searchTerm: string        = request.query.searchTerm;
    const sortOrientation: string   = request.query.sortOrientation;
    const skillsLiteral: string     = request.query.skills;
    const page: number              = request.query.page;
    const pageSize: number          = request.query.pageSize;

    const getCommunityMembersRequest: GetCommunityMembersRequest =
            new GetCommunityMembersRequest(myEmail, searchTerm, sortOrientation, skillsLiteral, page, pageSize);

    const community: GetCommunityResponse
                  = await this._userService.getCommunityMembers(getCommunityMembersRequest);

    response.send(community);
  }

  public async getCommunityMemberProfile(request: Request, response: Response): Promise<void> {
    const myEmail: string     = request.Principal ? request.Principal.Email : "";
    const profile: ProfileDTO = await this._userService.getCommunityMemberProfile(myEmail, request.params.userID);

    response.send(profile);
  }

  public async deleteMe(request: Request, response: Response): Promise<void> {
    const profile: ProfileDTO = await this._userService.deleteMe(request.Principal.Email);

    response.send(profile);
  }

  public async updateMyGeneralInformation(request: Request, response: Response): Promise<void> {
    const generalInformationSection: ProfileDTO = request.body as ProfileDTO;

    response.send(await this._userService.updateGeneralInformation(request.Principal.Email, generalInformationSection));
  }

  public async updateMySkills(request: Request, response: Response): Promise<void> {
    const skillsSection: number[] = request.body as number[];

    response.send(await this._userService.updateSkills(request.Principal.Email, skillsSection));
  }

  public async updateMyPhotoGallery(request: Request, response: Response): Promise<void> {
    const photoGallerySection: UserImage[] = request.body as UserImage[];

    response.send(await this._userService.updatePhotoGallery(request.Principal.Email, photoGallerySection));
  }

  public async updateMyVideoGallery(request: Request, response: Response): Promise<void> {
    const videoGallerySection: UpdateProfileSection<UserVideo> = request.body as UpdateProfileSection<UserVideo>;

    response.send(await this._userService.updateVideoGallery(request.Principal.Email, videoGallerySection));
  }

  public async updateMyAwards(request: Request, response: Response): Promise<void> {
    const awardsSection: UpdateProfileSection<Award> = request.body as UpdateProfileSection<Award>;

    response.send(await this._userService.updateAwards(request.Principal.Email, awardsSection));
  }

  public async updateMyExperience(request: Request, response: Response): Promise<void> {
    const experienceSection: UpdateProfileSection<Experience> = request.body as UpdateProfileSection<Experience>;

    response.send(await this._userService.updateExperience(request.Principal.Email, experienceSection));
  }

  public async updateMyEducation(request: Request, response: Response): Promise<void> {
    const educationSection: UpdateProfileSection<Education> = request.body as UpdateProfileSection<Education>;

    response.send(await this._userService.updateEducation(request.Principal.Email, educationSection));
  }

  public async register(request: Request, response: Response): Promise<void> {
    const register: RegisterDTO = request.body as RegisterDTO;

    await this._userService.register(register);

    response.sendStatus(200);
  }

  public async finishRegistration(request: Request, response: Response): Promise<void> {
    const finishRegistrationRequest: FinishRegistrationRequestDTO = request.body as FinishRegistrationRequestDTO;

    const finishRegistratioResponse: FinishRegistrationResponseDTO =
                    await this._userService.finishRegistration(finishRegistrationRequest.Email);

    response.send(finishRegistratioResponse);
  }

  public async forgotPassword(request: Request, response: Response): Promise<void> {

    await this._userService.forgotPassword(request.body.Email);

    response.sendStatus(200);
  }

  public async resetPassword(request: Request, response: Response): Promise<void> {

    const resetPasswordRequest: ResetPasswordRequestDTO = request.body as ResetPasswordRequestDTO;

    await this._userService.resetPassword(resetPasswordRequest);

    response.sendStatus(200);
  }

  public async changePassword(request: Request, response: Response): Promise<void> {

    const changePasswordRequest: ChangePasswordRequestDTO = request.body as ChangePasswordRequestDTO;

    const changePasswordResponse: ChangePasswordResponseDTO =
                                     await this._userService.changePassword(request.Principal.Email, changePasswordRequest);

    response.send(changePasswordResponse);
  }

  public async createProfile(request: Request, response: Response): Promise<void> {

    const profileDTO: ProfileDTO = request.body as ProfileDTO;
    profileDTO.Email             = request.Principal.Email;

    const createProfileResponse: CreateProfileResponseDTO = await this._userService.createProfile(profileDTO);

    response.send(createProfileResponse);
  }

  public async generateResume(request: Request, response: Response): Promise<void> {
    const resumeHTML: string = fs.readFileSync(path.join(process.cwd(), "src/views/resume", "Resume.html"), "utf8");
    const options = { "renderDelay": 2000 };
    pdf.create(resumeHTML, options).toStream(function(err: any, stream: any){
      stream.pipe(fs.createWriteStream("./foo.pdf"));
    });

    response.send();
  }

  public async getSettings(request: Request, response: Response): Promise<void> {

    const settings = await this._userService.getSettings(request.Principal.Email);

    response.send(settings);
  }

  public async updateSettings(request: Request, response: Response): Promise<void> {

    const settings = request.body as SettingsDTO;

    await this._userService.updateSettings(request.Principal.Email, settings);

    response.sendStatus(200);
  }

  public async create(request: Request, response: Response): Promise<void> {

    let user: User = {
      ...request.body,
      Role:      UserRoleType.User
    };

    const errorMessage = this.isUserValid(user);

    if (errorMessage) {
      response.status(400).json(errorMessage);
      response.end();
      return;
    }

    const dbUser = await this._userService.getByEmail(user.Email);

    if (dbUser) {
      response.status(400).json("This email address is already taken.");
      response.end();
      return;
    }

    user = await this._userService.create(user);

    response.send(user);
  }

  public async getAll(request: Request, response: Response): Promise<void> {

    const users: User[] = await this._userService.getAll();

    response.send(users);
  }

  public async getByID(request: Request, response: Response): Promise<void> {

    if (!request.params.userID || !Validators.isValidUUID(request.params.userID)) {
      response.status(400).json("Incorrect id.");
      response.end();
      return;
    }

    const user: User = await this._userService.getByID(request.params.userID);

    if (!user) {
      response.status(404).json("User not found.");
      response.end();
      return;
    }

    response.send(user);
  }

  public async update(request: Request, response: Response): Promise<void> {

    if (!request.params.userID || !Validators.isValidUUID(request.params.userID)) {
      response.status(400).json("Incorrect id.");
      response.end();
      return;
    }

    const errorMessage = this.isUserValid(request.body, false);

    if (errorMessage) {
      response.status(400).json(errorMessage);
      response.end();
      return;
    }

    let user: User = await this._userService.getByID(request.params.userID);

    if (!user) {
      response.status(404).json("User not found.");
      response.end();
      return;
    }

    user = {
      ...user,
      ...request.body
    };

    user = await this._userService.update(user);

    response.send(user);
  }

  public async delete(request: Request, response: Response): Promise<void> {

    let user: User = await this._userService.getByID(request.params.userID);

    if (!user) {
      response.status(404).json("User not found.");
      response.end();
      return;
    }

    user = await this._userService.deleteByID(request.params.userID);

    response.send(user);
  }

  public async enable(request: Request, response: Response): Promise<User> {

    if (!request.params.userID || !Validators.isValidUUID(request.params.userID)) {
      response.status(400).json("Incorrect id.");
      response.end();
      return;
    }

    let user: User = await this._userService.getByID(request.params.userID);

    if (!user) {
      response.status(404).json("User not found.");
      response.end();
      return;
    }

    user = await this._userService.enableByID(request.params.userID);

    response.send(user);
  }

  public async disable(request: Request, response: Response): Promise<User> {

    if (!request.params.userID || !Validators.isValidUUID(request.params.userID)) {
      response.status(400).json("Incorrect id.");
      response.end();
      return;
    }

    let user: User = await this._userService.getByID(request.params.userID);

    if (!user) {
      response.status(404).json("User not found.");
      response.end();
      return;
    }

    user = await this._userService.disableByID(request.params.userID);

    response.send(user);
  }

  private isUserValid(user: User, checkEmail: boolean = true): string {

    if ((user.Email || checkEmail) && !Validators.isValidEmail(user.Email)) {
      return "Incorrect email!";
    }

    if (user.PhoneNumber && !Validators.isValidPhoneNumber(user.PhoneNumber)) {
      return "Incorrect phone number!";
    }

    return;
  }

}
