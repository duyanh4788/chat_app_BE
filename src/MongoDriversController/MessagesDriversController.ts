import mongoose from 'mongoose';
import { TitleModel } from '../common/common.constants';
import { MessagesSchema, MessagesSchemaProps, ResponseListMessages } from '../models/messageModel';
import { IMessagesDriversRepository } from '../Repository/IMessagesDriversRepository';
import { RestError } from '../services/error/error';

export class MessagesDriversController implements IMessagesDriversRepository {
  private Messages = mongoose.model(TitleModel.MESSAGES, MessagesSchema);
  private selectMsg = ['conversationId', 'senderId', 'reciverId', 'text', 'createdAt'];

  async getListMessages(conversationId: string, skip: number): Promise<ResponseListMessages> {
    const listMessages = await this.Messages.find({
      conversationId
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(10)
      .select(this.selectMsg);
    const totalPage = await this.Messages.count();
    if (!listMessages || (listMessages && !listMessages.length)) {
      return { listMessages: [], totalPage, skip: 0 };
    }
    return {
      listMessages: listMessages.map((item) => this.transFromData(item)).reverse(),
      totalPage,
      skip: totalPage <= skip ? 0 : skip + 10
    };
  }

  async createNewMessages(body: MessagesSchemaProps): Promise<MessagesSchemaProps> {
    const newMessage = new this.Messages(body);
    await newMessage.save();
    return this.transFromData(newMessage);
  }

  async createNewMessagesSocket(body: MessagesSchemaProps): Promise<void> {
    const newMessage = new this.Messages(body);
    await newMessage.save();
    return;
  }

  private transFromData(data: any) {
    if (!data) return;
    return data._doc;
  }
}
