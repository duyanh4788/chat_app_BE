import * as mongoose from 'mongoose';
import { TitleModel } from '../../common/common.constants';
import { Request, Response, NextFunction } from 'express';
import { MessagesSchema } from '../../models/messageModel';
import { UsersSchema } from '../../models/userModel';
import { ConvertStationSchema } from '../../models/convertStationModel';
import { sendRespone } from '../../common/common.success';

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
      return sendRespone(res, 'error', 400, null, 'sender id not found!');
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
      return sendRespone(res, 'error', 400, null, 'convert station id not found!');
    }
    if (convertStationId) {
      next();
    }
  }
}
