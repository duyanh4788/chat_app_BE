import mongoose from 'mongoose';
import { TitleModel } from '../common/common.constants';
import { ConvertStationSchema } from '../models/convertStationModel';
import { IConvertStationDriversRepository } from '../Repository/IConvertStationDriversRepository';

export class ConvertStationDriversController implements IConvertStationDriversRepository {
  private ConvertStation = mongoose.model(TitleModel.CONVERTSTATIONS, ConvertStationSchema);

  async saveConverStation(senderId: string, reciverId: string): Promise<any> {
    let newConverStation = await new this.ConvertStation({
      members: [senderId, reciverId]
    });
    await newConverStation.save();
    return this.transFromData(newConverStation);
  }

  async findConverStation(senderId: string, reciverId: string): Promise<any> {
    let newConverStation = await this.ConvertStation.findOne({
      members: { $all: [senderId, reciverId] }
    });
    return this.transFromData(newConverStation);
  }

  private transFromData(data: any) {
    if (!data) return;
    return data._doc;
  }
}
