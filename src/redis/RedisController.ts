import * as redis from 'redis';
import * as util from 'util';

interface RedisCache {
  hasKey: string;
  key: string;
  values?: any;
}

interface RedisModel {
  keyModel: string;
  keyValue: string;
  value?: Record<string, any>;
  timer?: number;
}

class RedisController {
  private REDIS_URL: string = process.env.REDIS_URL as string;
  private TIMER: number = 3600;
  private client: redis.RedisClientType;

  constructor() {
    this.client = redis.createClient({ url: this.REDIS_URL });
    util.promisify(this.client.get).bind(this.client);
    this.connectRedist();
  }

  async connectRedist() {
    await this.client.connect();
  }

  async disconnectRedist() {
    await this.client.quit();
  }

  async getRedis({ keyModel, keyValue }: RedisModel) {
    const keys = `${keyModel}:${keyValue}`;
    const result = await this.client.get(keys);
    return JSON.parse(result as any);
  }

  async setRedis({ keyModel, keyValue, value }: RedisModel) {
    const keys = `${keyModel}:${keyValue}`;
    return await this.client.set(keys, JSON.stringify(value));
  }

  async getHasRedis({ hasKey, key }: RedisCache) {
    const result = await this.client.hGet(hasKey, key);
    return JSON.parse(result as any);
  }

  async setHasRedis({ hasKey, key, values }: RedisCache) {
    return await this.client.hSet(hasKey, key, JSON.stringify(values));
  }

  async clearHashRedis(key: string) {
    return await this.client.del(JSON.stringify(key));
  }
}

export const redisController = new RedisController();
