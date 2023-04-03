import { Response } from 'express';

export class RestError extends Error {
  public code?: number;
  public bodyErrors?: any;

  constructor(message: string, code?: number, bodyErrors?: any) {
    super(`${message}`);
    this.code = code;
    this.bodyErrors = bodyErrors;
    (Object as any).setPrototypeOf(this, new.target.prototype);
    this.name = 'RestError';
  }

  public static manageServerError(res: Response, err: any, success: boolean = false): Response {
    if (err instanceof RestError) {
      return res.status(err.code || 417).json({
        status: 'error',
        code: err.code,
        message: err.message,
        success
      });
    }
    return res.status(500).json({ status: 'error', message: 'Internal error' });
  }
}
