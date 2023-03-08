import dotenv from 'dotenv';
dotenv.config();

import App from './app/App';
import * as http from 'http';
import { Websocket } from './socket_io/socket_io';
import { Server } from 'socket.io';
import winston from 'winston';
import { RemoveImagesFromAWSJob } from './job/RemoveImagesFromAWSJob'


// ********************* logger *********************//
export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: './src/logger/error.log', level: 'error' }),
    new winston.transports.File({ filename: './src/logger/combined.log' }),
  ]
});

// ********************* BaseJob *********************//
const removeImagesFromAWSJob = new RemoveImagesFromAWSJob();
removeImagesFromAWSJob.runJob()

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

httpServer.listen(PORT, HOST, () => {
  console.log(`Running API on port : ${PORT}`);
});
