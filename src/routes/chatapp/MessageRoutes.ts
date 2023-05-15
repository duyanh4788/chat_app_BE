import { Router } from 'express';
import { MessageControler } from '../../controllers/MessageController';
import { VerifyTokenMiddleware } from '../../middlewares/auth/VerifyTokenMiddleware';
import { MessagesMiddleware } from '../../middlewares/messages/MessageMiddleware';
import { MessagesDriversController } from '../../MongoDriversController/MessagesDriversController';
import { MessagesUseCase } from '../../usecase/MessagesUseCase';
import { UserDriversController } from '../../MongoDriversController/UserDriversController';
import { FriendsDriversController } from '../../MongoDriversController/FriendsDriversController';
import { ConvertStationDriversController } from '../../MongoDriversController/ConvertStationDriversController';

const BASE_ROUTE = '/messages';

enum Routes {
  GET_LIST_MESSAGES = '/getListMessages',
  NEW_MESSAGE = '/newMessage',
  GET_ALL_LIST_MESSAGES = '/get-all'
}

export class MessagesRoutes {
  private verifyTokenMiddleware: VerifyTokenMiddleware = new VerifyTokenMiddleware();
  private messagesDriversController: MessagesDriversController = new MessagesDriversController();
  private userDriversController: UserDriversController = new UserDriversController();
  private convertStationDriversController: ConvertStationDriversController = new ConvertStationDriversController();
  private friendsDriversController: FriendsDriversController = new FriendsDriversController();
  private messagesUseCase: MessagesUseCase = new MessagesUseCase(this.messagesDriversController);
  private messagesControler: MessageControler = new MessageControler(this.messagesUseCase);
  private messagesMiddleware: MessagesMiddleware = new MessagesMiddleware(
    this.userDriversController,
    this.convertStationDriversController,
    this.friendsDriversController
  );

  public routes(app: Router): void {
    app.post(
      BASE_ROUTE + Routes.GET_LIST_MESSAGES,
      this.verifyTokenMiddleware.authenTicate,
      this.messagesMiddleware.checkConvertStationId,
      this.messagesControler.getListMessages
    );
    app.post(
      BASE_ROUTE + Routes.NEW_MESSAGE,
      this.verifyTokenMiddleware.authenTicate,
      this.messagesMiddleware.checkUserId,
      this.messagesControler.postNewMessages
    );
    app.get(BASE_ROUTE + Routes.GET_ALL_LIST_MESSAGES, this.messagesControler.getAllListMessages);
  }
}
