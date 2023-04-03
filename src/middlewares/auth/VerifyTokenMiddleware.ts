import * as JWT from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { USER_TYPE_CODE, SECRETKEY } from '../../common/common.constants';
import { SendRespone } from '../../services/success/success';

interface TokenPayload {
  [account: string]: any;
}

export class VerifyTokenMiddleware {
  public authenTicate(req: TokenPayload, res: Response, next: NextFunction) {
    try {
      const token = req.header('Authorization');
      const deCode: any = JWT.verify(token, SECRETKEY);
      const getTime = Math.round(new Date().getTime() / 1000);
      if (!deCode || deCode.exp < getTime) {
        return new SendRespone({
          status: 'error',
          code: 401,
          message: 'token expired, please login again.'
        }).send(res);
      }
      if (deCode) {
        req.account = deCode;
        next();
      }
    } catch (error) {
      return new SendRespone({
        status: 'error',
        code: 401,
        message: 'you have do not sign in.'
      }).send(res);
    }
  }

  public permissions(req: TokenPayload, res: Response, next: NextFunction) {
    if (
      USER_TYPE_CODE.includes(req.account.userTypeCode) &&
      req.account !== parseInt(req.params.account)
    ) {
      next();
    } else {
      return new SendRespone({
        status: 'error',
        code: 401,
        message: 'you are does not permissions remove account.'
      }).send(res);
    }
  }
}
