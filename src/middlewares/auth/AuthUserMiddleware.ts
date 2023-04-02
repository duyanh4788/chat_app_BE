import { Request, Response, NextFunction } from 'express';
import { validateValue } from '../../utils/validate';
import { IUserDriversRepository } from '../../Repository/IUserDriversRepository';
import { SendRespone } from '../../services/success/success';

export class AuthUserMiddleware {
  constructor(private userDriversRepository: IUserDriversRepository) {
    this.validateSignUp = this.validateSignUp.bind(this);
    this.checkAccountExits = this.checkAccountExits.bind(this);
  }

  public async validateSignUp(req: Request, res: Response, next: NextFunction) {
    const { account, passWord, fullName, email } = req.body;
    if (
      !validateValue(account) &&
      !validateValue(passWord) &&
      !validateValue(fullName) &&
      !validateValue(email)
    ) {
      return new SendRespone({ status: 'error', code: 404, message: 'Please input full information.' }).send(res)
    }
    if (!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
      return new SendRespone({ status: 'error', code: 404, message: 'Please input correct type email.' }).send(res);
    }
    if (account.length <= 4 && account.length >= 30) {
      return new SendRespone({ status: 'error', code: 404, message: 'length number form 6 => 30' }).send(res);
    }
    const acc = await this.userDriversRepository.findByAccount(account);
    if (acc) {
      return new SendRespone({ status: 'error', code: 404, message: 'user have exist.' }).send(res);
    }
    const em = await this.userDriversRepository.findByEmail(email);
    if (em) {
      return new SendRespone({ status: 'error', code: 404, message: 'email have exist.' }).send(res);
    }
    next();
  }

  public async checkAccountExits(req: Request, res: Response, next: NextFunction) {
    const { account } = req.body;
    const data = await this.userDriversRepository.findByAccount(account);
    if (!data) {
      next();
    } else {
      return new SendRespone({ status: 'error', code: 404, message: 'account have exist.' }).send(res);
    }
  }

  public checkNumber(req: Request, res: Response, next: NextFunction) {
    const { phone } = req.body;
    const pattern: any = /^[0-9]+$/;
    if (phone && phone.match(pattern)) {
      next();
    } else {
      return new SendRespone({ status: 'error', code: 404, message: 'please input number.' }).send(res);
    }
  }
}
