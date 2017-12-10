import MessagesRoutes  from "./MessagesRoutes";
import ProjectsRoutes  from "./ProjectsRoutes";
import UsersRoutes     from "./UsersRoutes";
import WishesRoutes    from "./WishesRoutes";

module.exports = (app: any) => {
    MessagesRoutes(app);
    ProjectsRoutes(app);
    UsersRoutes(app);
    WishesRoutes(app);
};