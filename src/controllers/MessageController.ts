import { Request, Response } from 'express';
import { sendRespone } from '../common/common.success';
import { RestError } from '../services/error/error';
import { MessagesUseCase } from '../usecase/MessagesUseCase';


export class MessageControler {

  constructor(private messagesUseCase: MessagesUseCase) {
    this.postNewMessages = this.postNewMessages.bind(this)
    this.getListMessages = this.getListMessages.bind(this)
  }

  public async postNewMessages(req: Request, res: Response) {
    try {
      const create = await this.messagesUseCase.postNewMessages(req.body)
      if (!create) throw new RestError('send messages failed', 400);
      return sendRespone(res, 'success', 200, create, '')
    } catch (error) {
      return RestError.manageServerError(res, error, false)
    }
  }

  public async getListMessages(req: Request, res: Response) {
    try {
      const listMessages = await this.messagesUseCase.getListMessages(req.body.conversationId);
      if (!listMessages.length) return sendRespone(res, 'success', 200, [], '')
      return sendRespone(res, 'success', 200, listMessages, '')
    } catch (error) {
      return RestError.manageServerError(res, error, false)
    }
  };
}