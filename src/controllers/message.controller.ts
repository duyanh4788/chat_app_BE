import * as mongoose from 'mongoose';
import { Request, Response } from 'express';
import { MessagesSchema } from '../models/messageModel';
import { TitleModel } from '../common/common.constants';

const Messages = mongoose.model(TitleModel.MESSAGES, MessagesSchema);

export class MessageControler {
  public async postNewMessages(req: Request, res: Response) {
    const newMessage = new Messages(req.body);
    try {
      const saveMessage = await newMessage.save();
      res.status(200).send({
        data: saveMessage,
        code: 200,
        success: true,
      });
    } catch (error) {
      res.status(500).send({
        code: 500,
        message: error,
        success: false,
      });
    }
  }

  public async getListMessages(req: Request, res: Response) {
    try {
      const listMessages = await Messages.find(
        {
          conversationId: req.body.conversationId,
        },
        '-_id',
      ).select([
        'conversationId',
        'senderId',
        'reciverId',
        'text',
        'createdAt',
      ]);
      if (!listMessages) {
        return res.status(400).send({
          data: null,
          message: 'List Messages Not Found!',
          code: 400,
          success: true,
        });
      }
      if (listMessages) {
        res.status(200).send({
          data: listMessages,
          message: null,
          code: 200,
          success: true,
        });
      }
    } catch (error) {
      res.status(500).send({
        code: 500,
        message: error,
        success: false,
      });
    }
  };
}
