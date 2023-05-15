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
    }).cache({ key: [senderId, reciverId] });
    return this.transFromData(newConverStation);
  }

  async findConverStationById(conversationId: string): Promise<any> {
    const convertStation = await await this.ConvertStation.findOne({
      _id: conversationId
    });
    return this.transFromData(convertStation);
  }

  private transFromData(data: any) {
    if (!data) return;
    return data._doc;
  }
}
