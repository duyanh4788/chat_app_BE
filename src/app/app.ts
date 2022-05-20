import express, { Request, Response, NextFunction } from 'express';
import * as bodyParser from 'body-parser';
import * as socketIo from 'socket.io';
import mongoose from 'mongoose';
import cros from 'cors';
import { createServer, Server } from 'http';
import { Routes } from '../routes';
import { Websocket } from '../socket_io/socket_io';

class App {
  public app: express.Application;
  private mainRoutes: Routes = new Routes();
  private mongooseUrl: string | any = process.env.DATABASE;
  private server: Server = new Server();
  private IO: socketIo.Server | undefined;
  private port: string | number | undefined;
  private webSocket: Websocket = new Websocket();

  constructor() {
    this.port = process.env.PORT_SOCKET || 5001;
    this.app = express();
    this.config();
    this.mainRoutes.routes(this.app);
    this.mongooSetup();
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

  private config(): void {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(cros());
    this.app.use(function (req: Request, res: Response, next: NextFunction) {
      res.header('Access-Control-Allow-Origin', '*');
      res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept',
      );
      next();
    });
  }

  private initSocket(): void {
    this.IO = new socketIo.Server(this.server);
  }

  private listenSocket(): void {
    this.server.listen(this.port, () => {
      console.log('Running SOCKET on port %s', this.port);
    });
    this.webSocket.socketIO(this.IO);
  }
}

export default new App().app;
