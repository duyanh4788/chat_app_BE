import { MessagesSchemaProps } from "../models/messageModel";


export interface IMessagesDriversRepository {
    getListMessages(conversationId: string): Promise<MessagesSchemaProps[]>;

    createNewMessages(body: MessagesSchemaProps): Promise<MessagesSchemaProps>;
}