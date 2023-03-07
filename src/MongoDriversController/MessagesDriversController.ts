import mongoose from "mongoose";
import { TitleModel } from "../common/common.constants";
import { MessagesSchema, MessagesSchemaProps } from "../models/messageModel";
import { IMessagesDriversRepository } from "../Repository/IMessagesDriversRepository";
import { RestError } from "../services/error/error";

export class MessagesDriversController implements IMessagesDriversRepository {

    private Messages = mongoose.model(TitleModel.MESSAGES, MessagesSchema);
    private selectUser = [
        'conversationId',
        'senderId',
        'reciverId',
        'text',
        'createdAt',
    ]

    async getListMessages(conversationId: string): Promise<MessagesSchemaProps[]> {
        const listMessages = await this.Messages.find({
            createdAt: { $lt: new Date() }
        }).sort({ createdAt: -1 }).limit(10).exec()
        if (!listMessages) throw new RestError('data not found', 400);
        const totalPage = await this.Messages.count();
        return listMessages
    }

    async createNewMessages(body: MessagesSchemaProps): Promise<MessagesSchemaProps> {
        const newMessage = new this.Messages(body);
        await newMessage.save();
        return newMessage
    }

}