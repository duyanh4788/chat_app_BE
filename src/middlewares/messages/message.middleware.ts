import * as mongoose from 'mongoose';
import { TitleModel } from '../../common/common.constants';
import { Request, Response, NextFunction } from 'express';
import { MessagesSchema } from '../../models/messageModel';
import { UsersSchema } from '../../models/userModel';
import { ConvertStationSchema } from '../../models/convertStationModel';

const Messages = mongoose.model(TitleModel.MESSAGES, MessagesSchema);
const ConvertStation = mongoose.model(
  TitleModel.CONVERTSTATIONS,
  ConvertStationSchema,
);
const Users = mongoose.model(TitleModel.USERS, UsersSchema);

export class MessagesMiddleware {
  public async checkUserId(req: Request, res: Response, next: NextFunction) {
    const senderInfor = await Users.findOne({
      _id: req.body.senderId,
    });
    if (!senderInfor) {
      return res.status(400).send({
        code: 400,
        message: 'sender id not found!',
        success: false,
      });
    }
    if (senderInfor) {
      next();
    }
  }

  public async checkConvertStationId(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const convertStationId = await ConvertStation.findOne({
      _id: req.body.conversationId,
    });
    if (!convertStationId) {
      return res.status(400).send({
        code: 400,
        message: 'convert station id not found!',
        success: false,
      });
    }
    if (convertStationId) {
      next();
    }
  }
}
