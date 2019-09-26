import AdministrationRoutes    from "./AdministrationRoutes";
import ApplicationDataRoutes   from "./ApplicationDataRoutes";
import AuthenticationRoutes    from "./AuthenticationRoutes";
import AwardsRoutes            from "./AwardsRoutes";
import EducationRoutes         from "./EducationRoutes";
import ExperienceRoutes        from "./ExperienceRoutes";
import ProjectNeedRoutes       from "./ProjectNeedRoutes";
import ProjectsRoutes          from "./ProjectsRoutes";
import ProjectUpdateRoutes     from "./ProjectUpdateRoutes";
import UsersRoutes             from "./UsersRoutes";
import UserVideosRoutes        from "./UserVideosRoutes";

module.exports = (app: any) => {
    AdministrationRoutes(app);
    ApplicationDataRoutes(app);
    AuthenticationRoutes(app);
    AwardsRoutes(app);
    EducationRoutes(app);
    ExperienceRoutes(app);
    ProjectNeedRoutes(app);
    ProjectsRoutes(app);
    ProjectUpdateRoutes(app);
    UsersRoutes(app);
    UserVideosRoutes(app);
};
