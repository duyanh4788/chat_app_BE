import * as redis from 'redis';
import * as util from 'util';

interface KeyRedis {
  keyModel: string;
  keyValue: string;
}

interface RedisModel {
  key: KeyRedis;
  value?: Object;
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

  async getRedis(key: any) {
    // const keys = `${key.keyModel}:${key.keyValue}`;
    const result = await this.client.get(key);
    return JSON.parse(result as any);
  }

  async setRedis(key: any, value: any) {
    // const keys = `${key?.keyModel}:${key?.keyValue}`;
    return await this.client.set(key, JSON.stringify(value));
  }
}

export const redisController = new RedisController();
