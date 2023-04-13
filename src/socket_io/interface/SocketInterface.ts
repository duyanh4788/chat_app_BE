import { Socket } from 'socket.io';
export interface SocketInterface {
  handleChatApp(socket: Socket): void;
  middlewareAuthorization(soccket: Socket, next: any): void;
}
