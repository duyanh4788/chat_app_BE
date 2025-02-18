import { NextFunction, Request, Response } from 'express';
import { redisController } from '../../redis/RedisController';
import { SendRespone } from '../../services/success/success';
import { isDevelopment } from '../../server';
import { config } from '../../config';

export class RequestLimitMiddleware {
  private MAX_REQUEST: number = parseInt(config.MAX_REQUEST || '0');
  private LIMIT_REQUEST: number = parseInt(config.LIMIT_REQUEST || '0');
  private LIMIT_TIMER: number = parseInt(config.LIMIT_TIMER || '0');
  private REQ_QUEUE: any[] = [];

  public validateRequestLimits = async (req: Request, res: Response, next: NextFunction) => {
    const ip: any = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const splitIp = isDevelopment ? ip : `${ip.split(':')[0]}_${req.cookies.userId}`;
    let getIp = await redisController.checkExitsKey(splitIp);
    if (!getIp) {
      getIp = await redisController.setNXRedis({ keyValue: splitIp, value: 0 });
      await redisController.setExpire(splitIp, this.LIMIT_TIMER);
    }
    getIp = await redisController.setIncreaseRedis(splitIp, 1);
    if (getIp > this.LIMIT_REQUEST) {
      return new SendRespone({ code: 402, message: 'request limit rate, please try again after some minutes!' }).send(res);
    }
    next();
  };

  public queueRequestLimits = (req: Request, res: Response, next: NextFunction) => {
    if (this.MAX_REQUEST > 0) {
      --this.MAX_REQUEST;
      next();
    } else {
      new Promise<void>((resolve) => {
        this.REQ_QUEUE.push({ next, resolve });
      }).then(() => {
        this.processQueue();
      });
    }
  };

  public processQueue = () => {
    if (!this.REQ_QUEUE.length) {
      this.resetMaxRequest();
    }
    if (this.REQ_QUEUE.length) {
      const req = this.REQ_QUEUE.shift();
      const next: NextFunction = req.next;
      const resolve = req.resolve;
      if (next) {
        this.MAX_REQUEST++;
        next();
      }
      if (resolve) {
        resolve();
      }
    }
  };

  private resetMaxRequest() {
    this.MAX_REQUEST = config.MAX_REQUEST as unknown as number;
  }
}
