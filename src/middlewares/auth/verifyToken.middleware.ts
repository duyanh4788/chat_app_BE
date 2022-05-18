import { JWT } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { USER_TYPE_CODE, SECRETKEY } from '../../common/common.constants';

interface TokenPayload {
  _id: string;
  account: string;
  userTypeCode: string;
}

export class VerifyTokenMiddleware {
  public authenTicate(req: any, res: Response, next: NextFunction) {
    try {
      const token = req.header('Authorization');
      const deCode: TokenPayload = JWT.verify(token, SECRETKEY);
      req.account = deCode;
      next();
    } catch (error) {
      res.status(400).send({
        code: 400,
        message: 'Your are not sign in',
        success: false,
      });
    }
  }

  public permissions(req: any, res: Response, next: NextFunction) {
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
      res.status(400).send({
        code: 400,
        message: 'Your Are note permissions remove account',
        success: false,
      });
    }
  }
}
