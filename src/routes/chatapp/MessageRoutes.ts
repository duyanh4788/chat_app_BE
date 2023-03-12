import { Router } from 'express';
import { MessageControler } from '../../controllers/MessageController';
import { MessagesMiddleware } from '../../middlewares/messages/MessageMiddleware';
import { MessagesDriversController } from '../../MongoDriversController/MessagesDriversController';
import { MessagesUseCase } from '../../usecase/MessagesUseCase';

const BASE_ROUTE = '/api/v1';

enum Routes {
  GET_LIST_MESSAGES = '/getListMessages',
  NEW_MESSAGE = '/newMessage'
}

export class MessagesRoutes {
  messagesDriversController: MessagesDriversController = new MessagesDriversController();
  messagesUseCase: MessagesUseCase = new MessagesUseCase(this.messagesDriversController);
  messagesControler: MessageControler = new MessageControler(this.messagesUseCase);
  messagesMiddleware: MessagesMiddleware = new MessagesMiddleware();

  public routes(app: Router): void {
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
