import { MessagesSchemaProps } from "../models/messageModel";
import { IMessagesDriversRepository } from "../Repository/IMessagesDriversRepository";


export class MessagesUseCase {
    constructor(private messagesDriversRepository: IMessagesDriversRepository) { }

    async postNewMessages(body: MessagesSchemaProps) {
        const create = await this.messagesDriversRepository.createNewMessages(body)
        return create
    }

    async getListMessages(conversationId: string, skip: number) {
        const listMessages = await this.messagesDriversRepository.getListMessages(conversationId, skip)
        return listMessages
    };
}