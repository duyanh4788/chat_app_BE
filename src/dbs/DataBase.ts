import mongoose from 'mongoose';
import { isDevelopment } from '../server';
import { logger } from '../services/loggerservice/Logger';
import { redisController } from '../redis/RedisController';

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

    mongoose.Query.prototype.cache = function (time = (60 * 60) as number) {
      this.useCache = true;
      this.cacheTime = time;
      return this;
    };

    mongoose.Query.prototype.exec = async function () {
      if (!this.useCache) {
        return exec.apply(this, arguments as any);
      }
      const collectionName = this.mongooseCollection.name;
      const key = JSON.stringify(
        Object.assign({
          ...this.getQuery(),
          collectionName
        })
      );
      console.log(key);
      const cacheValue = await redisController.getHasRedis({ collectionName, key });
      if (cacheValue) {
        return Array.isArray(cacheValue) ? cacheValue.map((item) => new this.model(item)) : new this.model(cacheValue);
      }
      const result = await exec.apply(this as any, arguments as any);
      await redisController.setHasRedis({ collectionName, key, values: result });
      return result;
    };
  }

  static getInstance() {
    if (!DataBase.instance) {
      DataBase.instance = new DataBase();
    }
    return DataBase.instance;
  }
}
