import { Router } from 'express';
import { ConverStationRoutes } from './chatapp/ConvertStationRoutes';
import { MessagesRoutes } from './chatapp/MessageRoutes';
import { UsersRoutes } from './chatapp/UserRoutes';

export class Routes {
  public usersRoutes: UsersRoutes = new UsersRoutes();
  public messagesRoutes: MessagesRoutes = new MessagesRoutes();
  public converStationRoutes: ConverStationRoutes = new ConverStationRoutes();
  public routes(app: Router): void {
    this.usersRoutes.routes(app);
    this.messagesRoutes.routes(app);
    this.converStationRoutes.routes(app);
  }
}
