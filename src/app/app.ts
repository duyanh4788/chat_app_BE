import express from 'express';
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
    this.app.use(cors({ credentials: true, origin: process.env.END_POINT }));
  }

  public configJson(): void {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
  }
}

export default new App().app;
