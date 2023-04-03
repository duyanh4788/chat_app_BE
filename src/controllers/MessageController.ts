import { Request, Response } from 'express';
import { RestError } from '../services/error/error';
import { SendRespone } from '../services/success/success';
import { MessagesUseCase } from '../usecase/MessagesUseCase';

export class MessageControler {
  constructor(private messagesUseCase: MessagesUseCase) {
    this.postNewMessages = this.postNewMessages.bind(this);
    this.getListMessages = this.getListMessages.bind(this);
  }

  public async postNewMessages(req: Request, res: Response) {
    try {
      const create = await this.messagesUseCase.postNewMessages(req.body);
      if (!create) throw new RestError('send messages failed', 400);
      return new SendRespone({ data: create }).send(res);
    } catch (error) {
      return RestError.manageServerError(res, error, false);
    }
  }

  public async getListMessages(req: Request, res: Response) {
    try {
      const { conversationId, skip } = req.body;
      const listMessages = await this.messagesUseCase.getListMessages(conversationId, skip);
      if (!listMessages)
        return new SendRespone({ data: { listMessages: [], totalPage: 0, skip: 0 } }).send(res);
      return new SendRespone({ data: listMessages }).send(res);
    } catch (error) {
      return RestError.manageServerError(res, error, false);
    }
  }
}
