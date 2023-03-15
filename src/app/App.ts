import express, { Request, Response, NextFunction } from 'express';
import seesion, { SessionOptions } from 'express-session';
import mongoose from 'mongoose';
import cors from 'cors';
import { Routes } from '../routes';
import * as bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import { SECRETKEY } from '../common/common.constants';

const sessionOptions: SessionOptions = {
  secret: SECRETKEY,
  resave: true,
  saveUninitialized: true
};

class App {
  public App: express.Application;
  private mainRoutes: Routes = new Routes();
  private mongooseUrl: string | any = process.env.DATABASE;

  constructor() {
    this.App = express();
    this.configCors();
    this.configJson();
    this.mongooSetup();
    this.mainRoutes.routes(this.App);
  }

  private mongooSetup(): void {
    (<any>mongoose).Promise = global.Promise;
    mongoose
      .connect(this.mongooseUrl)
      .then(() => console.log('MongoDB connect success'))
      .catch((error) => console.log(error));
    mongoose.connection;
  }

  public configCors(): void {
    this.App.use((req: Request, res: Response, next: NextFunction) => {
      res.header('Access-Control-Allow-Origin', process.env.END_POINT_HOME);
      res.header('Access-Control-Allow-Origin', process.env.END_POINT);
      res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
      res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
      );
      next();
    });
    this.App.options(`${process.env.END_POINT_HOME}`);
    this.App.options(`${process.env.END_POINT}`);
    this.App.use(cors());
    this.App.use(seesion(sessionOptions));
  }

  public configJson(): void {
    this.App.use(bodyParser.json());
    this.App.use(bodyParser.urlencoded({ extended: false }));
    this.App.use(express.json({ limit: '50mb' }));
    this.App.use(express.urlencoded({ limit: '50mb', extended: false }));
    this.App.use(cookieParser());
    this.App.use(logger('dev'));
  }
}

export default new App().App;
