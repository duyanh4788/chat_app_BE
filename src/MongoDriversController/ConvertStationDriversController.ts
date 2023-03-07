import mongoose from "mongoose";
import { TitleModel } from "../common/common.constants";
import { ConvertStationSchema } from "../models/convertStationModel";
import { MessagesSchema, MessagesSchemaProps } from "../models/messageModel";
import { IConvertStationDriversRepository } from "../Repository/IConvertStationDriversRepository";
import { IMessagesDriversRepository } from "../Repository/IMessagesDriversRepository";
import { RestError } from "../services/error/error";

export class ConvertStationDriversController implements IConvertStationDriversRepository {
    private ConvertStation = mongoose.model(TitleModel.CONVERTSTATIONS, ConvertStationSchema);

    async saveConverStation(senderId: string, reciverId: string): Promise<any[]> {
        let newConverStation = await new this.ConvertStation({
            members: [senderId, reciverId],
        });
        await newConverStation.save();
        return newConverStation
    }

}