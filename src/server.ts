/**
 * Module dependencies.
 */
import "reflect-metadata";
import * as express       from "express";
import * as compression   from "compression";  // compresses requests
import * as session       from "express-session";
import * as bodyParser    from "body-parser";
import * as logger        from "morgan";
import * as errorHandler  from "errorhandler";
import * as lusca         from "lusca";
import * as dotenv        from "dotenv";
import * as flash         from "express-flash";
import * as path          from "path";
import * as passport      from "passport";
import * as models        from "./models";
import chalk              from "chalk";
import { createConnection, Connection } from "typeorm";
const expressValidator   = require("express-validator");

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.config({ path: ".env.example" });

/**
 * API keys and Passport configuration.
 */
import * as passportConfig    from "./config/passport";
import { IBaseApiController } from "./controllers";

// create connection with database
// note that it's not active database connection
// TypeORM creates connection pools and uses them for your requests
createConnection().then(async (connection: Connection) => {

  /**
   * Create Express server.
   */

  const app: express.Application = express();

  /**
   * Express configuration.
   */

  app.set("port", process.env.PORT || 4000);
  app.set("models", models);
  app.use(compression());
  app.use(logger("dev"));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(expressValidator());
  app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());
  app.use(lusca.xframe("SAMEORIGIN"));
  app.use(lusca.xssProtection(true));
  app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
  });
  app.use((req, res, next) => {
    // After successful login, redirect back to the intended page
    if (!req.user &&
        req.path !== "/login" &&
        req.path !== "/signup" &&
        !req.path.match(/^\/auth/) &&
        !req.path.match(/\./)) {
      req.session.returnTo = req.path;
    } else if (req.user &&
        req.path == "/account") {
      req.session.returnTo = req.path;
    }
    next();
  });
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    next();
  });
  app.use(express.static(path.join(__dirname, "public"), { maxAge: 31557600000 }));

  /**
   * Routes (route handlers).
   */

  require("./routes")(app);

  /**
   * OAuth authentication routes. (Sign in)
   */
  app.get("/auth/facebook", passport.authenticate("facebook", { scope: ["email", "public_profile"] }));
  app.get("/auth/facebook/callback", passport.authenticate("facebook", { failureRedirect: "/login" }), (req, res) => {
    res.redirect(req.session.returnTo || "/");
  });

  /**
   * Error Handler. Provides full stack - remove for production
   */
  app.use(errorHandler());

  /**
   * Start Express server.
   */
  app.listen(app.get("port"), () => {
    console.log(("  App is running at http://localhost:%d in %s mode"), app.get("port"), app.get("env"));
    console.log("  Press CTRL-C to stop\n");
  });
}).catch(error => console.log("TypeORM connection error: ", error));
