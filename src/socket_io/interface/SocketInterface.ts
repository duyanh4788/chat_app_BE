import { Socket } from "socket.io";

export interface InfoUser {
    socketId: string;
    _id: string;
    account: string;
    fullName: string;
    email: string;
    avatar: string;
    isOnline: boolean;
}

export interface DataMessages {
    conversationId: string;
    senderId: string;
    reciverId: string;
    text: string;
}

export interface SocketInterface {
    handleChatApp(socket: Socket): void;
    middlewareAuthorization(soccket: Socket, next: any): void;
}
