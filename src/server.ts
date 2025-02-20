import dotenv from 'dotenv';
dotenv.config();
import App from './app/App';
import { Request, Response } from 'express';
import * as http from 'http';
import { WebSocket } from './socket_io/WebSocket';
import { RemoveImagesFromAWSJob } from './job/RemoveImagesFromAWSJob';
import { Connections } from './monitor/Connecttions';
import { RemoveFileLocalJob } from './job/RemoveImagesLocalJob';
import { Server } from 'socket.io';
import { config } from './config';

export const isDevelopment = config.NODE_ENV === 'development' ? true : false;

// ********************* BaseJob *********************//
new RemoveImagesFromAWSJob().runJob();
new RemoveFileLocalJob().runJob();

// ********************* monitor *********************//
new Connections().readMonitorServer();

// ********************* Config Server *********************//
const httpServer: http.Server = http.createServer(App);
if (isDevelopment) {
  App.get('/', (req: Request, res: Response) => {
    res.send('Server is Running ...');
  });
}
httpServer.listen(config.PORT, () => {
  console.log(`Running API on port : ${config.PORT}`);
});

// ********************* Config Socket *********************//
const socketServer: http.Server = http.createServer(); // Server riêng cho WebSocket
const io = new Server(socketServer, {
  cors: {
    origin: config.END_POINT_HOME || '*',
    credentials: true
  },
  path: config.PARAM_SOCKET
});
const socket = new WebSocket();
socket.socketIO(io);
socketServer.listen(config.SOCKET_PORT, () => {
  console.log(`🔌 WebSocket Server running on port: ${config.SOCKET_PORT}`);
});



