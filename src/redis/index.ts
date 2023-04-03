import { createClient } from 'redis';

interface RedisModel {
    keyModel: string,
    keyValue: string,
    value?: Object,
    timer?: number,
}

class RedisController {
    private REDIS_URL: string = process.env.REDIS_URL as string;
    private readonly client: any;
    private TIMER: number = 3600;

    constructor() {
        this.client = createClient({ url: this.REDIS_URL });
        this.connectRedist()
    }

    async connectRedist() {
        await this.client.connect();
    }

    async disconnectRedist() {
        await this.client.connect();
    }

    async getRedis({ keyModel, keyValue }: RedisModel) {
        const key = `${keyModel}:${keyValue}`
        const result = await this.client.get(key)
        return JSON.parse(result);
    }

    async setRedis({ keyModel, keyValue, value }: RedisModel) {
        const key = `${keyModel}:${keyValue}`;
        return await this.client.set(key, JSON.stringify(value))
    }
}

export const redisController = new RedisController();