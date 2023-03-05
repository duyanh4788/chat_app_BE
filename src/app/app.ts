import express from 'express';
import * as bodyParser from 'body-parser';
import mongoose from 'mongoose';
import { Routes } from '../routes';
const cors = require('cors');

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
    const websiteWhitelist = [process.env.END_POINT_HOME, process.env.END_POINT];
    const corsOptions = {
      origin: (origin: string, callback: Function) => {
        if (websiteWhitelist.indexOf(origin) !== -1 || !origin) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true
    }
    this.app.use(cors(corsOptions));
  }

  public configJson(): void {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
  }
}

export default new App().app;
