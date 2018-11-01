import { inject, injectable }  from "inversify";
import { Request, Response }   from "express";
import chalk                   from "chalk";
import * as uuid               from "uuid/v4";
import { Application }         from "express";
import { TYPES }               from "../types";
import { User }                from "../models/User";
import { IUsersController }    from "./IUsersController";
import { BaseApiController }   from "./BaseApiController";
import { IUserService }        from "../services";
import { UserRoleType }        from "../enums";
import { Validators }          from "../utils";

@injectable()
export class UsersController extends BaseApiController<User> implements IUsersController {

  private readonly _userService: IUserService;

  constructor(@inject(TYPES.UserService) userService: IUserService) {
    super(userService);
    this._userService = userService;
  }

  public async create(request: Request, response: Response): Promise<void> {

    let user: User = {
      ...request.body,
      IsActive:  true,
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

    user = await this._userService.deleteByID(request.params.userID);

    response.send(user);
  }

  private isUserValid(user: User, checkEmail: boolean = true): string {

    if ((user.Email || checkEmail) && !Validators.isValidEmail(user.Email)) {
      return "Incorrect email!";
    }

    if (user.Phone && !Validators.isValidPhone(user.Phone)) {
      return "Incorrect phone number!";
    }

    return;
  }

}
