import { NextFunction, Request, Response } from 'express';
import { redisController } from '../../redis/RedisController';
import { SendRespone } from '../../services/success/success';

export class RequestLimitMiddleware {
  private MAX_REQUEST: number = parseInt(process.env.MAX_REQUEST || '0');
  private LIMIT_REQUEST: number = parseInt(process.env.LIMIT_REQUEST || '0');
  private LIMIT_TIMER: number = parseInt(process.env.LIMIT_TIMER || '0');
  private REQ_QUEUE: any[] = [];

  public validateRequestLimits = async (req: Request, res: Response, next: NextFunction) => {
    const ip: any = req.headers['x-forwarded-for']?.toString() || req.socket.remoteAddress?.toString();
    let getIp = await redisController.checkExitsKey(ip);
    if (!getIp) {
      getIp = await redisController.setNXRedis({ keyValue: ip, value: 0 });
      await redisController.setExpire(ip, this.LIMIT_TIMER);
    }
    getIp = await redisController.setIncreaseRedis(ip, 1);
    if (getIp > this.LIMIT_REQUEST) {
      return new SendRespone({ code: 401, message: 'request limit rate, please try again after some minutes!' }).send(res);
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
    this.MAX_REQUEST = process.env.MAX_REQUEST as unknown as number;
  }
}
