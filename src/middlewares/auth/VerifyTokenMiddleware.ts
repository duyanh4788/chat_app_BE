import * as JWT from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { USER_TYPE_CODE, SECRETKEY } from '../../common/common.constants';

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
        return res
          .status(404)
          .json({
            status: 'error',
            code: 401,
            data: null,
            message: 'token expired, please login again.'
          });
      }
      if (deCode) {
        req.account = deCode;
        next();
      }
    } catch (error) {
      return res
        .status(404)
        .json({ status: 'error', code: 404, data: null, message: 'you have don`t not sign in.' });
    }
  }

  public permissions(req: TokenPayload, res: Response, next: NextFunction) {
    try {
      if (
        USER_TYPE_CODE.includes(req.account.userTypeCode) &&
        req.account !== parseInt(req.params.account)
      ) {
        next();
      } else {
        throw new Error();
      }
    } catch (error) {
      return res
        .status(404)
        .json({
          status: 'error',
          code: 404,
          data: null,
          message: 'you are does not permissions remove account.'
        });
    }
  }
}
