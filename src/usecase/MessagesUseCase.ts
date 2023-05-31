import { IMessagesDriversRepository } from '../Repository/IMessagesDriversRepository';
import { TitleModel } from '../common/common.constants';
import { MessagesSchemaProps } from '../common/common.interface';
import { redisController } from '../redis/RedisController';
import { RestError } from '../services/error/error';

export class MessagesUseCase {
  constructor(private messagesDriversRepository: IMessagesDriversRepository) {}

  async postNewMessages(body: MessagesSchemaProps) {
    const create = await this.messagesDriversRepository.createNewMessages(body);
    return create;
  }

  async getListMessages(conversationId: string, skip: number) {
    const listMessages = await this.messagesDriversRepository.getListMessages(conversationId, skip);
    return listMessages;
  }

  async getAllListMessages() {
    const listMessages = await this.messagesDriversRepository.getAllListMessages();
    const message = await this.messagesDriversRepository.getMessagesById();
    if (!message || !message.total) throw new RestError('total is zero', 400);
    let getMsg = await redisController.getRedis(`${TitleModel.MESSAGES}_647206e925f962bf4fec4716`);
    if (!getMsg) {
      getMsg = await redisController.setRedis({ keyValue: `${TitleModel.MESSAGES}_647206e925f962bf4fec4716`, value: message });
    }
    let totalLast = await redisController.getRedis('totalLast');
    if (!totalLast) {
      totalLast = await redisController.setRedis({ keyValue: 'totalLast', value: 0 });
    }
    if (totalLast > getMsg.total) {
      await redisController.clearHashRedis(`${TitleModel.MESSAGES}_647206e925f962bf4fec4716`);
      throw new RestError('total is zero', 400);
    }
    totalLast = await redisController.setIncreaseRedis('totalLast', 1);
    await this.messagesDriversRepository.updateMessagesById(-1);
    return;
  }
}
