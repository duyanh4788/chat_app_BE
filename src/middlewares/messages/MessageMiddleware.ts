import * as mongoose from 'mongoose';
import { TitleModel } from '../../common/common.constants';
import { Request, Response, NextFunction } from 'express';
import { UsersSchema } from '../../models/userModel';
import { ConvertStationSchema } from '../../models/convertStationModel';
import { SendRespone } from '../../services/success/success';

const ConvertStation = mongoose.model(TitleModel.CONVERTSTATIONS, ConvertStationSchema);
const Users = mongoose.model(TitleModel.USERS, UsersSchema);

export class MessagesMiddleware {
  public async checkUserId(req: Request, res: Response, next: NextFunction) {
    const senderInfor = await Users.findOne({
      _id: req.body.senderId
    });
    if (!senderInfor) {
      return new SendRespone({ message: 'sender id not found!' }).send(res);
    }
    if (senderInfor) {
      next();
    }
  }

  public async checkConvertStationId(req: Request, res: Response, next: NextFunction) {
    const convertStationId = await ConvertStation.findOne({
      _id: req.body.conversationId
    });
    if (!convertStationId) {
      return new SendRespone({ message: 'convert station id not found!' }).send(res);
    }
    if (convertStationId) {
      next();
    }
  }
}
