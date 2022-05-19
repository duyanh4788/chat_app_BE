import * as mongoose from 'mongoose';
import { Request, Response } from 'express';
import { ConvertStationSchema } from '../models/convertStationModel';
import { TitleModel } from '../common/common.constants';

const ConvertStation = mongoose.model(
  TitleModel.CONVERTSTATIONS,
  ConvertStationSchema,
);

export class ConverStationController {
  public async saveConverStation(req: Request, res: Response) {
    const { senderId, reciverId } = req.body;
    try {
      const newConverStation = await new ConvertStation({
        members: [senderId, reciverId],
      });
      const saveConverStation = await newConverStation.save();
      return res.status(200).send({
        data: saveConverStation,
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
}
