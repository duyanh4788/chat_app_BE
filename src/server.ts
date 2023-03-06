import dotenv from 'dotenv';
dotenv.config();

import app from './app/App';
import { Websocket } from './socket_io/socket_io';
import { Request, Response } from 'express';
import * as http from 'http';
import { Server } from 'socket.io';

const PORT: string | number | any = process.env.PORT || 5000;
const HOST: string = '0.0.0.0';

app.get('/', (req: Request, res: Response) => {
  res.send('Server is Running ...');
});
const httpServer: http.Server = http.createServer(app);
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
