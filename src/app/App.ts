import express, { Router } from 'express';
import seesion, { SessionOptions } from 'express-session';
import cors from 'cors';
import { MainRoutes } from '../routes';
import * as bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import { PATH_IMG, PATH_PUBLISH, PATH_VIDEO, SECRETKEY } from '../common/common.constants';
import MongoStore from 'connect-mongo';
import { DataBase } from '../dbs/DataBase';
import path from 'path';
import fs from 'fs';
import { RequestLimitMiddleware } from '../middlewares/requestlimit/RequestLimitMiddleware';
import { config } from '../config';

const sessionOptions: SessionOptions = {
  secret: SECRETKEY,
  resave: true,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: config.DATABASE,
    ttl: 14 * 24 * 60 * 60,
    autoRemove: 'native'
  })
};
class App {
  public App: express.Application;
  public ApiRouter: Router;
  private mainRoutes: MainRoutes = new MainRoutes();
  private requestLimitMiddleware: RequestLimitMiddleware = new RequestLimitMiddleware();
  private paramDic: string = config.PARAM_SEVER as string;
  constructor() {
    this.ApiRouter = Router();
    this.App = express();
    this.configCors();
    this.configJson();
    this.mongooSetup();
    this.initStaticFile();
    this.interValQueue();
    this.App.use(this.paramDic, this.requestLimitMiddleware.validateRequestLimits, this.requestLimitMiddleware.queueRequestLimits, this.ApiRouter);
    this.mainRoutes.routes(this.ApiRouter);
  }

  private mongooSetup(): void {
    const mongoodb = new DataBase();
    mongoodb.connectDB();
  }

  public configCors(): void {
    this.App.enable('trust proxy');
    this.App.use(seesion(sessionOptions));
    this.App.use(
      cors({
        origin: '*',
        credentials: true
      })
    );
  }

  public configJson(): void {
    this.App.use(cookieParser());
    this.App.use(bodyParser.json());
    this.App.use(bodyParser.urlencoded({ extended: false }));
    this.App.use(express.json({ limit: '50mb' }));
    this.App.use(express.urlencoded({ limit: '50mb', extended: false }));
    this.App.use(logger('dev'));
  }

  public initStaticFile() {
    const publics = path.join(__dirname, `../../${PATH_PUBLISH}`);
    const images = path.join(__dirname, `../../${PATH_IMG}`);
    const videos = path.join(__dirname, `../../${PATH_VIDEO}`);

    if (!fs.existsSync(publics)) {
      fs.mkdirSync(publics, { recursive: true });
      console.log(`${publics} created successfully!`);
    } else {
      console.log(`${publics} already exists!`);
    }

    if (!fs.existsSync(images)) {
      fs.mkdirSync(images, { recursive: true });
      console.log(`${images} created successfully!`);
    } else {
      console.log(`${images} already exists!`);
    }
    if (!fs.existsSync(videos)) {
      fs.mkdirSync(videos, { recursive: true });
      console.log(`${videos} created successfully!`);
    } else {
      console.log(`${videos} already exists!`);
    }

    global._pathFileImages = images;
    global._pathFileVideo = videos;

    const publicImg = config.NODE_ENV === 'production' ? `${config.PARAM_STATIC}/${PATH_IMG}` : `/${PATH_IMG}`;
    const publicVideo = config.NODE_ENV === 'production' ? `${config.PARAM_STATIC}/${PATH_VIDEO}` : `/${PATH_VIDEO}`;

    this.App.use(publicImg, express.static(_pathFileImages));
    this.App.use(publicVideo, express.static(_pathFileVideo));
  }

  public interValQueue() {
    setInterval(this.requestLimitMiddleware.processQueue, 1000);
  }
}

export default new App().App;
