import { Container }                                                                   from "inversify";
import { TYPES }                                                                       from "../types/custom-types";
import { IAuthenticationController, IMessagesController, IProjectsController,
    IUsersController, IWishesController, AuthenticationController, MessagesController,
    ProjectsController, UsersController, WishesController }                            from "../controllers";
import { IMessageService, IProjectService, IUserService, IWishService,
    MessageService, ProjectService, UserService, WishService, IAuthenticationService, AuthenticationService }                         from "../services";
import { IMessageRepository, IProjectRepository, IUserRepository, IWishRepository,
    MessageRepository, ProjectRepository, UserRepository, WishRepository }             from "../repositories";

const container = new Container();

container.bind<IAuthenticationController>(TYPES.AuthenticationController).to(AuthenticationController);
container.bind<IMessagesController>(TYPES.MessagesController).to(MessagesController);
container.bind<IProjectsController>(TYPES.ProjectsController).to(ProjectsController);
container.bind<IUsersController>(TYPES.UsersController).to(UsersController);
container.bind<IWishesController>(TYPES.WishesController).to(WishesController);

container.bind<IAuthenticationService>(TYPES.AuthenticationService).to(AuthenticationService);
container.bind<IMessageService>(TYPES.MessageService).to(MessageService);
container.bind<IProjectService>(TYPES.ProjectService).to(ProjectService);
container.bind<IUserService>(TYPES.UserService).to(UserService);
container.bind<IWishService>(TYPES.WishService).to(WishService);

container.bind<IMessageRepository>(TYPES.MessageRepository).to(MessageRepository);
container.bind<IProjectRepository>(TYPES.ProjectRepository).to(ProjectRepository);
container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);
container.bind<IWishRepository>(TYPES.WishRepository).to(WishRepository);

export {container};
