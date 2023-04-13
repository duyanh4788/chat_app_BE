import * as JWT from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { USER_TYPE_CODE, SECRETKEY } from '../../common/common.constants';
import { SendRespone } from '../../services/success/success';
import { UserRequest } from '../../common/common.interface';
export class VerifyTokenMiddleware {
  public authenTicate(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.header('Authorization');
      const deCode: any = JWT.verify(token as string, SECRETKEY);
      const getTime = Math.round(new Date().getTime() / 1000);
      if (!deCode || deCode.exp < getTime) {
        return new SendRespone({
          status: 'error',
          code: 401,
          message: 'token expired, please login again.'
        }).send(res);
      }
      if (deCode) {
        req.user = deCode;
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

  public permissions(req: Request, res: Response, next: NextFunction) {
    const { user }: UserRequest | any = req;
    if (!user || (user && !USER_TYPE_CODE.includes(user.userTypeCode))) {
      return new SendRespone({
        status: 'error',
        code: 401,
        message: 'you are does not permissions remove account.'
      }).send(res);
    }
    next();
  }
}
