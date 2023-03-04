import express, { Request, Response, NextFunction } from 'express';
import * as bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import { Routes } from '../routes';

class App {
  public app: express.Application;
  private mainRoutes: Routes = new Routes();
  private mongooseUrl: string | any = process.env.DATABASE;

  constructor() {
    this.app = express();
    this.configCors();
    this.configJson();
    this.mongooSetup();
    this.mainRoutes.routes(this.app);
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
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      res.header('Access-Control-Allow-Origin', process.env.END_POINT_HOME);
      res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
      res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
      )
      next();
    });
    this.app.options(`${process.env.END_POINT_HOME}`);
    this.app.use(cors());
  }

  public configJson(): void {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
  }
}

export default new App().app;
