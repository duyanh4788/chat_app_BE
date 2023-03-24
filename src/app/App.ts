import express, { Request, Response, NextFunction } from 'express';
import seesion, { SessionOptions } from 'express-session';
import cors from 'cors';
import { Routes } from '../routes';
import * as bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import { SECRETKEY } from '../common/common.constants';
import MongoStore from 'connect-mongo';
import { DataBase } from '../dbs/DataBase';

const sessionOptions: SessionOptions = {
  secret: SECRETKEY,
  resave: true,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.DATABASE,
    ttl: 14 * 24 * 60 * 60,
    autoRemove: 'native'
  })
};

class App {
  public App: express.Application;
  private mainRoutes: Routes = new Routes();

  constructor() {
    this.App = express();
    this.configCors();
    this.configJson();
    this.mongooSetup();
    this.mainRoutes.routes(this.App);
  }

  private mongooSetup(): void {
    const mongoodb = new DataBase();
    mongoodb.connectDB();
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
