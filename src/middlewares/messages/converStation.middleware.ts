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
    if (
      senderId &&
      senderId !== '' &&
      senderId !== null &&
      reciverId &&
      reciverId !== '' &&
      reciverId !== null
    ) {
      return next();
    } else {
      return res.status(400).send({
        code: 400,
        message: 'Id Sender or Reciver is null',
        success: false,
      });
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
      res.status(500).send({
        code: 500,
        message: error,
        success: false,
      });
    }
  }
}
