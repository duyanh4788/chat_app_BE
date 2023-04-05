import * as redis from "redis"
import * as util from "util"

interface RedisModel {
    keyModel: string;
    keyValue: string;
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

    async getRedis({ keyModel, keyValue }: RedisModel) {
        const key = `${keyModel}:${keyValue}`;
        const result = await this.client.get(key);
        return JSON.parse(result as any);
    }

    async setRedis({ keyModel, keyValue, value }: RedisModel) {
        const key = `${keyModel}:${keyValue}`;
        return await this.client.set(key, JSON.stringify(value));
    }
}

export const redisController = new RedisController();
