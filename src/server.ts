import dotenv from 'dotenv';
dotenv.config();
import path from 'path';
import App from './app/App';
import { Request, Response } from 'express';
import * as http from 'http';
import { WebSocket } from './socket_io/WebSocket';
import { RemoveImagesFromAWSJob } from './job/RemoveImagesFromAWSJob';
import { Connections } from './monitor/Connecttions';
import { RemoveImagesLocalJob } from './job/RemoveImagesLocalJob';
import { Server } from 'socket.io';

export const isDevelopment = process.env.NODE_ENV === 'development' ? true : false;

// ********************* BaseJob *********************//
new RemoveImagesFromAWSJob().runJob();
new RemoveImagesLocalJob().runJob();

// ********************* monitor *********************//
new Connections().readMonitorServer();

// ********************* Config Server *********************//
const PORT: string | number = process.env.PORT || 50005;
const httpServer: http.Server = http.createServer(App);

const configIo = new Server(httpServer, {
  cors: {
    origin: process.env.END_POINT,
    credentials: true
  }
});

const socket = new WebSocket();
socket.socketIO(configIo);

if (isDevelopment) {
  App.get('/', (req: Request, res: Response) => {
    res.send('Server is Running ...');
  });
}

httpServer.listen(PORT, () => {
  console.log(`Running API on port : ${PORT}`);
});
