import * as mongoose from 'mongoose';
import { TitleModel } from '../../common/common.constants';
import { Request, Response, NextFunction } from 'express';
import { ConvertStationSchema } from '../../models/convertStationModel';

const ConvertStation = mongoose.model(
  TitleModel.CONVERTSTATIONS,
  ConvertStationSchema,
);

export class ConverStationMiddleware {
  public checkEmptyId(req: Request, res: Response, next: NextFunction) {
    const { senderId, reciverId } = req.body;
    if (senderId && senderId !== '' && reciverId && reciverId !== '') {
      return next();
    } else {
      return res.status(404).json({ status: 'error', code: 404, data: null, message: 'id Sender or Reciver is null!' });
    }
  }
  public async getConverStationByUserId(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const { senderId, reciverId } = req.body;
    const converStationByUserId = await ConvertStation.findOne({
      members: { $all: [senderId, reciverId] },
    });
    if (converStationByUserId) {
      return res.status(200).send({
        data: converStationByUserId,
        code: 200,
        success: true,
      });
    }
    if (!converStationByUserId) {
      next();
    }
  }
}
