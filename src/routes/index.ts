import { Router } from 'express';
import { ConverStationRoutes } from './chatapp/ConvertStationRoutes';
import { MessagesRoutes } from './chatapp/MessageRoutes';
import { UploadAWSRouter } from './chatapp/UploadAWSRouter';
import { UsersRoutes } from './chatapp/UserRoutes';
import { FriendsRoutes } from './chatapp/FriendsRoutes';

export class MainRoutes {
  public usersRoutes: UsersRoutes = new UsersRoutes();
  public messagesRoutes: MessagesRoutes = new MessagesRoutes();
  public converStationRoutes: ConverStationRoutes = new ConverStationRoutes();
  public uploadAWSRouter: UploadAWSRouter = new UploadAWSRouter();
  public friendsRoutes: FriendsRoutes = new FriendsRoutes();

  public routes(app: Router): Router {
    this.usersRoutes.routes(app);
    this.messagesRoutes.routes(app);
    this.converStationRoutes.routes(app);
    this.uploadAWSRouter.routes(app);
    this.friendsRoutes.routes(app);
    return Router();
  }
}
