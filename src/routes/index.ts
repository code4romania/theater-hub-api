import AuthenticationRoutes    from "./AuthenticationRoutes";
import MessagesRoutes          from "./MessagesRoutes";
import ProjectsRoutes          from "./ProjectsRoutes";
import UsersRoutes             from "./UsersRoutes";
import WishesRoutes            from "./WishesRoutes";

module.exports = (app: any) => {
    AuthenticationRoutes(app);
    MessagesRoutes(app);
    ProjectsRoutes(app);
    UsersRoutes(app);
    WishesRoutes(app);
};
