import { NextFunction, Request, Response } from 'express';
import { redisController } from '../../redis/RedisController';
import { SendRespone } from '../../services/success/success';

export class RequestLimitMiddleware {
  private MAX_REQUEST: number = process.env.MAX_REQUEST as unknown as number;
  private REQ_QUEUE: any[] = [];

  public validateRequestLimits = async (req: Request, res: Response, next: NextFunction) => {
    const ip: any = req.headers['x-forwarded-for']?.toString() || req.socket.remoteAddress?.toString();
    let getIp = await redisController.getRedis(ip);
    if (getIp === 20) {
      return new SendRespone({ code: 401, message: 'request limit rate, please try again after some minutes!' }).send(res);
    }
    if (!getIp) {
      getIp = await redisController.setRedis({ keyValue: ip, value: 1 });
      await redisController.setExpire(ip, 60);
    }
    await redisController.setIncreaseRedis(ip, 1);
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
