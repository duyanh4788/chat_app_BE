import * as mongoose from 'mongoose';
import { TitleModel } from '../../common/common.constants';
import { Request, Response, NextFunction } from 'express';
import { ConvertStationSchema } from '../../models/convertStationModel';
import { sendRespone } from '../../common/common.success';

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
      return sendRespone(res, 'error', 400, null, 'Id Sender or Reciver is null');
    }
  }
  public async getConverStationByUserId(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const { senderId, reciverId } = req.body;
    try {
      const converStationByUserId = await ConvertStation.findOne({
        members: { $all: [senderId, reciverId] },
      });
      if (converStationByUserId !== null) {
        return res.status(200).send({
          data: converStationByUserId,
          code: 200,
          success: true,
        });
      }
      if (converStationByUserId === null) {
        next();
      }
    } catch (error) {
      return sendRespone(res, 'error', 500, null, 'can not get converstation');
    }
  }
}
