import mongoose from 'mongoose';
import { isDevelopment } from '../server';
import { logger } from '../services/loggerservice/Logger';

export class DataBase {
  private readonly MONGOOSE_URL: string | any = process.env.DATABASE;
  static instance: any;
  constructor() {
    this.QueryExec();
  }

  public async connectDB() {
    if (isDevelopment) {
      mongoose.set('debug', true);
      mongoose.set('debug', { color: true });
    }
    mongoose.set('strictQuery', false);
    try {
      mongoose.set('strictQuery', false);
      await mongoose.connect(this.MONGOOSE_URL);
      console.log(`MongoDB connect success. Number connect: ${mongoose.connections.length}`);
    } catch (error) {
      logger.error('BaseJob', { error: error, message: 'mongosedb error' });
    }
  }

  public QueryExec() {
    const exec = mongoose.Query.prototype.exec;
    mongoose.Query.prototype.exec = async function (): Promise<any> {
      const key: any = Object.assign({}, this.getQuery(), {
        collection: this.mongooseOptions.name
      });
      console.log(key)
      return await exec.apply(this, arguments as any);
    };
  }

  static getInstance() {
    if (!DataBase.instance) {
      DataBase.instance = new DataBase();
    }
    return DataBase.instance;
  }
}
