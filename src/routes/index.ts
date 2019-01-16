import ApplicationDataRoutes   from "./ApplicationDataRoutes";
import AuthenticationRoutes    from "./AuthenticationRoutes";
import AwardsRoutes            from "./AwardsRoutes";
import EducationRoutes         from "./EducationRoutes";
import ExperienceRoutes        from "./ExperienceRoutes";
import MessagesRoutes          from "./MessagesRoutes";
import ProjectsRoutes          from "./ProjectsRoutes";
import UsersRoutes             from "./UsersRoutes";
import UserVideosRoutes        from "./UserVideosRoutes";
import WishesRoutes            from "./WishesRoutes";

module.exports = (app: any) => {
    ApplicationDataRoutes(app);
    AuthenticationRoutes(app);
    AwardsRoutes(app);
    EducationRoutes(app);
    ExperienceRoutes(app);
    MessagesRoutes(app);
    ProjectsRoutes(app);
    UsersRoutes(app);
    UserVideosRoutes(app);
    WishesRoutes(app);
};
