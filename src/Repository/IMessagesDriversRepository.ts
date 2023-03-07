import { MessagesSchemaProps, ResponseListMessages } from "../models/messageModel";


export interface IMessagesDriversRepository {
    getListMessages(conversationId: string, skip: number): Promise<ResponseListMessages>;

    createNewMessages(body: MessagesSchemaProps): Promise<MessagesSchemaProps>;
}