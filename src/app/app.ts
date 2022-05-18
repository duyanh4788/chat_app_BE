import express, { Request, Response, NextFunction } from 'express';
import * as bodyParser from 'body-parser';
import cros from 'cors';
import mongoose from 'mongoose';
import { Routes } from '../routes';

class App {
  public app: express.Application;
  public mainRoutes: Routes = new Routes();
  public mongooseUrl: string | any = process.env.DATABASE;

  constructor() {
    this.app = express();
    this.config();
    this.mainRoutes.routes(this.app);
    this.mongooSetup();
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
}

export default new App().app;
