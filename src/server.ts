import dotenv from 'dotenv';
dotenv.config();
import path from 'path';
import App from './app/App';
import express, { Request, Response } from 'express';
import * as http from 'http';
import { WebSocket } from './socket_io/WebSocket';
import { RemoveImagesFromAWSJob } from './job/RemoveImagesFromAWSJob';
import { Connections } from './monitor/Connecttions';
import { OrdersSocket } from './socket_io/order/OrdersSocket';
import { RemoveImagesLocalJob } from './job/RemoveImagesLocalJob';

export const isDevelopment = process.env.NODE_ENV === 'development' ? true : false;

// ********************* Init Static File Images *********************//
global._pathFile = path.join(__dirname, '../public/images');
App.use('/public/images', express.static(_pathFile));

// ********************* BaseJob *********************//
new RemoveImagesFromAWSJob().runJob();
new RemoveImagesLocalJob().runJob();

// ********************* monitor *********************//
new Connections().readMonitorServer();

// ********************* Config Server *********************//
const PORT: string | number = process.env.PORT || 50005;
const httpServer: http.Server = http.createServer(App);

const _IO = WebSocket.getInstance(httpServer);
_IO.initializeHandlers(new OrdersSocket());

if (isDevelopment) {
  App.get('/', (req: Request, res: Response) => {
    res.send('Server is Running ...');
  });
}

httpServer.listen(PORT, () => {
  console.log(`Running API on port : ${PORT}`);
});
