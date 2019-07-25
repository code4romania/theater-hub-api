import AdministrationRoutes    from "./AdministrationRoutes";
import ApplicationDataRoutes   from "./ApplicationDataRoutes";
import AuthenticationRoutes    from "./AuthenticationRoutes";
import AwardsRoutes            from "./AwardsRoutes";
import EducationRoutes         from "./EducationRoutes";
import ExperienceRoutes        from "./ExperienceRoutes";
import ProjectsRoutes          from "./ProjectsRoutes";
import UsersRoutes             from "./UsersRoutes";
import UserVideosRoutes        from "./UserVideosRoutes";

module.exports = (app: any) => {
    AdministrationRoutes(app);
    ApplicationDataRoutes(app);
    AuthenticationRoutes(app);
    AwardsRoutes(app);
    EducationRoutes(app);
    ExperienceRoutes(app);
    ProjectsRoutes(app);
    UsersRoutes(app);
    UserVideosRoutes(app);
};
