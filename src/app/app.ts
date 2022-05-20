import express, { Request, Response, NextFunction } from 'express';
import * as bodyParser from 'body-parser';
import * as socketIo from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import { createServer, Server } from 'http';
import { Routes } from '../routes';
import { Websocket } from '../socket_io/socket_io';

class App {
  public app: express.Application;
  private mainRoutes: Routes = new Routes();
  private host: string | any = '0.0.0.0';
  private mongooseUrl: string | any = process.env.DATABASE;
  private server: Server = new Server();
  private IO: socketIo.Server | undefined;
  private webSocket: Websocket = new Websocket();

  constructor() {
    this.app = express();
    this.configCors();
    this.configJson();
    this.mongooSetup();
    this.mainRoutes.routes(this.app);
    this.server = createServer(this.app);
    this.initSocket();
    this.listenSocket();
  }

  private mongooSetup(): void {
    (<any>mongoose).Promise = global.Promise;
    mongoose
      .connect(this.mongooseUrl)
      .then(() => console.log('MongoDB connect success'))
      .catch(error => console.log(error));
    mongoose.connection;
  }

  public configCors(): void {
    this.app.use(cors());
    this.app.use(function (req: Request, res: Response, next: NextFunction) {
      res.header('Cache-Control', 'no-cache');
      res.header('Access-Control-Allow-Origin', '***');
      res.header('Accept', '*/*');
      next();
    });
  }

  public configJson(): void {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
  }

  private initSocket(): void {
    this.IO = new socketIo.Server(this.server);
  }

  private listenSocket(): void {
    this.server.listen(process.env.PORT_SOCKET || 5001, this.host, () => {
      console.log('Running SOCKET on port %s', process.env.PORT_SOCKET || 5001);
    });
    this.webSocket.socketIO(this.IO);
  }
}

export default new App().app;
