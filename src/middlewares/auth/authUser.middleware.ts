import { TitleModel } from '../../common/common.constants';
import { Request, Response, NextFunction } from 'express';
import { UsersSchema } from '../../models/userModel';
import * as mongoose from 'mongoose';

const Users = mongoose.model(TitleModel.USERS, UsersSchema);

export class AuthUserMiddleware {
  public checkEmpty(req: Request, res: Response, next: NextFunction) {
    const { account, passWord, fullName, email } = req.body;
    if (account !== '' && passWord !== '' && fullName !== '' && email !== '') {
      next();
    } else {
      res.status(400).send({
        code: 400,
        message: 'Please input full information.',
        success: false,
      });
    }
  }

  public async checkAccount(req: Request, res: Response, next: NextFunction) {
    const { account } = req.body;
    const data = await Users.findOne({ account });
    if (!data) {
      next();
    } else {
      res.status(400).send({
        code: 400,
        message: 'Account have exist.',
        success: false,
      });
    }
  }

  public checkEmailPattern(req: Request, res: Response, next: NextFunction) {
    const { email } = req.body;
    const pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (email.match(pattern)) {
      next();
    } else {
      res.status(400).send({
        code: 400,
        message: 'Please input correct type email.',
        success: false,
      });
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
      res.status(400).send({
        code: 400,
        message: 'Email have exist.',
        success: false,
      });
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
      res.status(400).send({
        code: 400,
        message: 'Account not found.',
        success: false,
      });
    }
  }

  public checkNumber(req: Request, res: Response, next: NextFunction) {
    const { phone } = req.body;
    const pattern: any = /^[0-9]+$/;
    if (phone && phone.match(pattern)) {
      next();
    } else {
      res.status(400).send({
        code: 400,
        message: 'Please input number.',
        success: false,
      });
    }
  }

  public checkReqLength(req: Request, res: Response, next: NextFunction) {
    const { account } = req.body;
    if (account.length > 4 && account.length < 30) {
      next();
    } else {
      res.status(400).send({
        code: 400,
        message: 'length number form 6 => 20',
        success: false,
      });
    }
  }

  public checkFullName(req: Request, res: Response, next: NextFunction) {
    const { fullName } = req.body;
    if (fullName !== typeof 'string') {
      next();
    } else {
      res.status(400).send({
        code: 400,
        message: 'First name and last name wrong format.',
        success: false,
      });
    }
  }
}
