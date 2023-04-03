import { Response } from 'express';

export enum TypeResponse {
  SUCCESS = 'success',
  ERROR = 'error'
}

export enum StatusCode {
  SUCCESS = 200,
  AUTH_ERROR = 401,
  LOGIC_ERROR = 400,
  VALIDATE_ERROR = 404,
  SYSTEM = 500
}

interface Success {
  code?: number;
  status?: string;
  data?: any;
  message?: string;
  option?: any;
}

class SuccessResponse {
  public code: number;
  public status: string;
  public data: any;
  public message: string;
  public option: any;

  constructor({
    status = TypeResponse.SUCCESS,
    code = StatusCode.SUCCESS,
    data = null,
    message = '',
    option = null
  }) {
    this.status = status;
    this.code = code || 200;
    this.data = data || null;
    this.message = message || '';
    this.option = option || null;
  }

  send(res: Response) {
    return res.status(this.code).json(this);
  }

  redirect(res: Response) {
    return res.redirect(this.data);
  }
}

export class SendRespone extends SuccessResponse {
  constructor({ data, message }: Success) {
    super({ data, message });
  }
}
