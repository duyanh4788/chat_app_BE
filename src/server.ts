import dotenv from 'dotenv';
dotenv.config();

import App from './app/App';
import { Request, Response } from 'express';
import * as http from 'http';
import { Websocket } from './socket_io/socket_io';
import { Server } from 'socket.io';
import { RemoveImagesFromAWSJob } from './job/RemoveImagesFromAWSJob';
import { Connections } from './monitor/Connecttions';

export const isDevelopment = process.env.NODE_ENV === 'development' ? true : false


// ********************* BaseJob *********************//
const removeImagesFromAWSJob = new RemoveImagesFromAWSJob();
removeImagesFromAWSJob.runJob();

// ********************* Config *********************//
const PORT: string | number | any = process.env.PORT || 5000;
const HOST: string = '0.0.0.0';

const httpServer: http.Server = http.createServer(App);

const configIo = new Server(httpServer, {
  cors: {
    origin: process.env.END_POINT,
    credentials: true
  }
});

const socket = new Websocket();
socket.socketIO(configIo);


// ********************* monitor *********************//
const monitor = new Connections();
monitor.readMonitorServer()

if (isDevelopment) {
  App.get('/', (req: Request, res: Response) => {
    res.send('Server is Running ...');
  });
}

httpServer.listen(PORT, HOST, () => {
  console.log(`Running API on port : ${PORT}`);
});
