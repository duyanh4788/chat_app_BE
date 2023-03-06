import { TitleModel } from '../../common/common.constants';
import { Request, Response, NextFunction } from 'express';
import { UsersSchema } from '../../models/userModel';
import * as mongoose from 'mongoose';
import { sendRespone } from '../../common/common.success';

const Users = mongoose.model(TitleModel.USERS, UsersSchema);

export class AuthUserMiddleware {
  public checkEmpty(req: Request, res: Response, next: NextFunction) {
    const { account, passWord, fullName, email } = req.body;
    if (account !== '' && passWord !== '' && fullName !== '' && email !== '') {
      next();
    } else {
      sendRespone(res, 'error', 400, null, 'Please input full information.')
    }
  }

  public async checkAccount(req: Request, res: Response, next: NextFunction) {
    const { account } = req.body;
    const data = await Users.findOne({ account });
    if (!data) {
      next();
    } else {
      sendRespone(res, 'error', 400, null, 'Account have exist.')
    }
  }

  public checkEmailPattern(req: Request, res: Response, next: NextFunction) {
    const { email } = req.body;
    const pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (email.match(pattern)) {
      next();
    } else {
      sendRespone(res, 'error', 400, null, 'Please input correct type email.')
    }
  }

  public async checkEmailExits(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const { email } = req.body;
    const data = await Users.findOne({ email });
    if (!data) {
      next();
    } else {
      sendRespone(res, 'error', 400, null, 'Email have exist.')
    }
  }

  public async checkAccountSingin(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const { account } = req.body;
    const data = await Users.findOne({ account });
    if (data) {
      next();
    } else {
      sendRespone(res, 'error', 400, null, 'Account not found.')
    }
  }

  public checkNumber(req: Request, res: Response, next: NextFunction) {
    const { phone } = req.body;
    const pattern: any = /^[0-9]+$/;
    if (phone && phone.match(pattern)) {
      next();
    } else {
      sendRespone(res, 'error', 400, null, 'Please input number.')
    }
  }

  public checkReqLength(req: Request, res: Response, next: NextFunction) {
    const { account } = req.body;
    if (account.length > 4 && account.length < 30) {
      next();
    } else {
      sendRespone(res, 'error', 400, null, 'length number form 6 => 30')
    }
  }

  public checkFullName(req: Request, res: Response, next: NextFunction) {
    const { fullName } = req.body;
    if (fullName !== typeof 'string') {
      next();
    } else {
      sendRespone(res, 'error', 400, null, 'First name and last name wrong format.')
    }
  }
}
