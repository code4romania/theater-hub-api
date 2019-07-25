import * as passport                from "passport";
import * as passportLocal           from "passport-local";
import * as passportFacebook        from "passport-facebook";
import * as passportGoogle          from "passport-google-oauth2";
import * as _                       from "lodash";
import { container }                from "../config/inversify.config";
import { Request, Response,
               NextFunction }       from "express";
import { TYPES }                    from "../types/custom-types";
import { IUserService }             from "../contracts";
import { RegisterDTO }              from "../dtos";
import { User }                     from "../models";
import { UserAccountProviderType }  from "../enums/UserAccountProviderType";

const config                     = require("./env").getConfig();

const FacebookStrategy   = passportFacebook.Strategy;
const GoogleStrategy     = passportGoogle.Strategy;

passport.serializeUser<any, any>((user, done) => {
  done(undefined, user.ID);
});

passport.deserializeUser(async (id: string, done) => {
  const userService: IUserService  = container.get<IUserService>(TYPES.UserService);
  const dbUser: User               = await userService.getByID(id);

  done(undefined, dbUser);
});

/**
 * OAuth Strategy Overview
 *
 * - User is already logged in.
 *   - Check if there is an existing account with a provider id.
 *     - If there is, return an error message. (Account merging not supported)
 *     - Else link new OAuth account with currently logged-in user.
 * - User is not logged in.
 *   - Check if it's a returning user.
 *     - If returning user, sign in and we are done.
 *     - Else check if there is an existing account with user's email.
 *       - If there is, return an error message.
 *       - Else create a new account.
 */

const strategyHandler = async (request: any, accessToken: any, refreshToken: any, profile: any, done: any, accountProvider: UserAccountProviderType) => {
  const firstName: string = profile.name.givenName;
  const lastName: string  = profile.name.familyName;
  const email: string     = profile.email || profile.emails[0].value;

  const userService: IUserService  = container.get<IUserService>(TYPES.UserService);
  let dbUser: User                 = await userService.getByEmail(email);

  if (!dbUser) {
    const registerDTO: RegisterDTO = {
      FirstName: firstName,
      LastName: lastName,
      Email: email
    } as RegisterDTO;

    dbUser = await userService.register(registerDTO, accountProvider);
  }

  done(undefined, dbUser);
};

/**
 * Sign in with Google.
 */
passport.use(new GoogleStrategy({
    clientID: config.google.app_id,
    clientSecret: config.google.app_secret,
    callbackURL: config.google.callback_url,
    passReqToCallback: true
  }, (request: any, accessToken: any, refreshToken: any, profile: any, done: any) => strategyHandler(request, accessToken, refreshToken, profile, done, UserAccountProviderType.Google)));

/**
 * Sign in with Facebook.
 */
passport.use(new FacebookStrategy({
    clientID: config.facebook.app_id,
    clientSecret: config.facebook.app_secret,
    callbackURL: config.facebook.callback_url,
    profileFields: ["name", "email", "link", "locale", "timezone"],
    passReqToCallback: true
  }, (request: any, accessToken: any, refreshToken: any, profile: any, done: any) => strategyHandler(request, accessToken, refreshToken, profile, done, UserAccountProviderType.Facebook)));

/**
 * Login Required middleware.
 */
export let isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

/**
 * Authorization Required middleware.
 */
export let isAuthorized = (req: Request, res: Response, next: NextFunction) => {
  const provider = req.path.split("/").slice(-1)[0];

  if (_.find(req.user.tokens, { kind: provider })) {
    next();
  } else {
    res.redirect(`/auth/${provider}`);
  }
};
