import { Router } from 'express';
import { ConverStationRoutes } from './childRouter/convertStation.routes';
import { MessagesRoutes } from './childRouter/message.routes';
import { UsersRoutes } from './childRouter/user.routes';

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
