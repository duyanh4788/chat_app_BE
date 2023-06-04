import express, { Router } from 'express';
import seesion, { SessionOptions } from 'express-session';
import cors from 'cors';
import { MainRoutes } from '../routes';
import * as bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import { SECRETKEY } from '../common/common.constants';
import MongoStore from 'connect-mongo';
import { DataBase } from '../dbs/DataBase';
import path from 'path';
import fs from 'fs';
import { RequestLimitMiddleware } from '../middlewares/requestlimit/RequestLimitMiddleware';

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
  public ApiRouter: Router;
  private mainRoutes: MainRoutes = new MainRoutes();
  private requestLimitMiddleware: RequestLimitMiddleware = new RequestLimitMiddleware();

  constructor() {
    this.ApiRouter = Router();
    this.App = express();
    this.configCors();
    this.configJson();
    this.mongooSetup();
    this.initStaticFile();
    this.validateRequestLimits();
    this.App.use('/api/v1', this.ApiRouter);
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
        origin: process.env.END_POINT_HOME,
        credentials: true
      })
    );
  }

  public configJson(): void {
    this.App.use(bodyParser.json());
    this.App.use(bodyParser.urlencoded({ extended: false }));
    this.App.use(express.json({ limit: '50mb' }));
    this.App.use(express.urlencoded({ limit: '50mb', extended: false }));
    this.App.use(cookieParser());
    this.App.use(logger('dev'));
  }

  public initStaticFile() {
    const publics = path.join(__dirname, '../../data_publish');
    const images = path.join(__dirname, '../../data_publish/images');
    const videos = path.join(__dirname, '../../data_publish/videos');
    const imagesTest = path.join(__dirname, '../../data_publish/img-test');

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
    if (!fs.existsSync(imagesTest)) {
      fs.mkdirSync(imagesTest, { recursive: true });
      console.log(`${imagesTest} created successfully!`);
    } else {
      console.log(`${imagesTest} already exists!`);
    }

    global._pathFileImages = path.join(__dirname, '../../data_publish/images');
    global._pathFileVideo = path.join(__dirname, '../../data_publish/videos');
    global._pathFileImgTest = path.join(__dirname, '../../data_publish/img-test');
    this.App.use('/data_publish/images', express.static(_pathFileImages));
    this.App.use('/data_publish/videos', express.static(_pathFileVideo));
  }

  public validateRequestLimits() {
    this.App.use(this.requestLimitMiddleware.validateRequestLimits);
    this.App.use(this.requestLimitMiddleware.queueRequestLimits);
    setInterval(this.requestLimitMiddleware.processQueue, 1000);
  }
}

export default new App().App;
