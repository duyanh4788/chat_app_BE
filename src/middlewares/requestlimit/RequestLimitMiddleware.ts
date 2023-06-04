import { NextFunction, Request, Response } from 'express';

export class RequestLimitMiddleware {
  private MAX_REQUEST: number = process.env.MAX_REQUEST as unknown as number;
  private REQ_QUEUE: any[] = [];

  public validateRequestLimit = (req: Request, res: Response, next: NextFunction) => {
    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    console.log('IP Address:', ipAddress);
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
