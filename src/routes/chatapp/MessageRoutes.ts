import { Router } from 'express';
import { MessageControler } from '../../controllers/MessageController';
import { VerifyTokenMiddleware } from '../../middlewares/auth/VerifyTokenMiddleware';
import { MessagesMiddleware } from '../../middlewares/messages/MessageMiddleware';
import { MessagesDriversController } from '../../MongoDriversController/MessagesDriversController';
import { MessagesUseCase } from '../../usecase/MessagesUseCase';

const BASE_ROUTE = '/api/v1';

enum Routes {
  GET_LIST_MESSAGES = '/getListMessages',
  NEW_MESSAGE = '/newMessage'
}

export class MessagesRoutes {
  private verifyTokenMiddleware: VerifyTokenMiddleware = new VerifyTokenMiddleware();
  private messagesDriversController: MessagesDriversController = new MessagesDriversController();
  private messagesUseCase: MessagesUseCase = new MessagesUseCase(this.messagesDriversController);
  private messagesControler: MessageControler = new MessageControler(this.messagesUseCase);
  private messagesMiddleware: MessagesMiddleware = new MessagesMiddleware();

  public routes(app: Router): void {
    app.use(this.verifyTokenMiddleware.authenTicate);
    app.post(
      BASE_ROUTE + Routes.GET_LIST_MESSAGES,
      this.messagesMiddleware.checkConvertStationId,
      this.messagesControler.getListMessages
    );
    app.post(
      BASE_ROUTE + Routes.NEW_MESSAGE,
      this.messagesMiddleware.checkUserId,
      this.messagesControler.postNewMessages
    );
  }
}
