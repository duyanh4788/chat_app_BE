import mongoose from 'mongoose';
import { isDevelopment } from '../server';
import { logger } from '../services/loggerservice/Logger';
import { redisController } from '../redis/RedisController';

export class DataBase {
  private readonly MONGOOSE_URL: string = process.env.DATABASE as string;
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
      const options = {
        autoIndex: false, // Don't build indexes
        maxPoolSize: 10, // Maintain up to 10 socket connections
        serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        family: 4 // Use IPv4, skip trying IPv6
      };
      await mongoose.connect(this.MONGOOSE_URL, options);
      console.log(`MongoDB connect success. Number connect: ${mongoose.connections.length}`);
    } catch (error) {
      logger.error('BaseJob', { error: error, message: 'mongosedb error' });
    }
  }

  public QueryExec() {
    mongoose.Query.prototype.cache = function (options: any) {
      this.useCache = true;
      this.hashKey = JSON.stringify(options.key || '');
      return this;
    };

    const exec = mongoose.Query.prototype.exec;
    mongoose.Query.prototype.exec = async function () {
      if (!this.useCache) {
        return exec.apply(this, arguments as any);
      }
      const key = JSON.stringify(
        Object.assign({}, this.getQuery(), {
          collection: this.mongooseCollection.name
        })
      );
      const cacheValue = await redisController.getHasRedis({ hasKey: this.hashKey, key });
      if ((cacheValue && !Array.isArray(cacheValue)) || (Array.isArray(cacheValue) && cacheValue.length)) {
        return Array.isArray(cacheValue) ? cacheValue.map((item) => new this.model(item)) : new this.model(cacheValue);
      }
      const result = await exec.apply(this as any, arguments as any);
      await redisController.setHasRedis({ hasKey: this.hashKey, key, values: result });
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
