import { MessagesSchemaProps, ResponseListMessages } from '../common/common.interface';

export interface IMessagesDriversRepository {
  getListMessages(conversationId: string, skip: number): Promise<ResponseListMessages>;

  createNewMessages(body: MessagesSchemaProps): Promise<MessagesSchemaProps>;

  getAllListMessages(): Promise<MessagesSchemaProps[]>;
}
