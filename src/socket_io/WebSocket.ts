import * as http from 'http';
import { Server } from 'socket.io';
import { SOCKET_COMMIT } from '../common/common.constants';
import { SocketInterface } from './interface/SocketInterface';

const WEBSOCKET_CORS = {
  origin: process.env.END_POINT,
  credentials: true,
  methods: ["GET", "POST"]
}

export class WebSocket extends Server {
  private static io: WebSocket;

  constructor(httpServer: http.Server) {
    super(httpServer, {
      cors: WEBSOCKET_CORS
    });
  }

  public static getInstance(httpServer: http.Server): WebSocket {
    if (!WebSocket.io) {
      WebSocket.io = new WebSocket(httpServer);
    }
    return WebSocket.io;
  }

  public initializeHandlers(socketHandlers: SocketInterface) {
    WebSocket.io.use(socketHandlers.middlewareAuthorization)
    WebSocket.io.on(SOCKET_COMMIT.CONNECT, socketHandlers.handleChatApp)
  }
}
