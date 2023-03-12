import { Request, Response, NextFunction } from 'express';
import { validateValue } from '../../utils/validate';
import { IUserDriversRepository } from '../../Repository/IUserDriversRepository';

export class AuthUserMiddleware {

  constructor(private userDriversRepository: IUserDriversRepository) {
    this.validateSignUp = this.validateSignUp.bind(this);
    this.checkAccountExits = this.checkAccountExits.bind(this);
  }

  public async validateSignUp(req: Request, res: Response, next: NextFunction) {
    const { account, passWord, fullName, email } = req.body;
    if (!validateValue(account) && !validateValue(passWord) && !validateValue(fullName) && !validateValue(email)) {
      return res.status(404).json({ status: 'error', code: 404, data: null, message: 'Please input full information.' });
    }
    if (!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
      return res.status(404).json({ status: 'error', code: 404, data: null, message: 'Please input correct type email.' });
    }
    if (account.length <= 4 && account.length >= 30) {
      return res.status(404).json({ status: 'error', code: 404, data: null, message: 'length number form 6 => 30' });
    }
    const acc = await this.userDriversRepository.findByAccount(account);
    if (acc) {
      return res.status(404).json({ status: 'error', code: 404, data: null, message: 'user have exist.' });
    }
    const em = await this.userDriversRepository.findByEmail(account);
    if (em) {
      return res.status(404).json({ status: 'error', code: 404, data: null, message: 'email have exist.' });
    }
    next()
  }

  public async checkAccountExits(req: Request, res: Response, next: NextFunction) {
    const { account } = req.body;
    const data = await this.userDriversRepository.findByAccount(account);
    if (!data) {
      next();
    } else {
      return res.status(404).json({ status: 'error', code: 404, data: null, message: 'account have exist.' });
    }
  }

  public checkNumber(req: Request, res: Response, next: NextFunction) {
    const { phone } = req.body;
    const pattern: any = /^[0-9]+$/;
    if (phone && phone.match(pattern)) {
      next();
    } else {
      return res.status(404).json({ status: 'error', code: 404, data: null, message: 'please input number.' });
    }
  }
}
