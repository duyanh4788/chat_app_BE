import { Router } from 'express';
import { MessageControler } from '../../controllers/message.controller';
import { MessagesMiddleware } from '../../middlewares/messages/message.middleware';

export class MessagesRoutes {
  messagesControler: MessageControler = new MessageControler();
  messagesMiddleware: MessagesMiddleware = new MessagesMiddleware();
  public routes(app: Router): void {
    app
      .route('/api/v1/getListMessages')
      .post(
        this.messagesMiddleware.checkConvertStationId,
        this.messagesControler.postNewMessages,
      );
    app
      .route('/api/v1/newMessage')
      .post(
        this.messagesMiddleware.checkUserId,
        this.messagesControler.getListMessages,
      );
  }
}
