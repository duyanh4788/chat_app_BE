import { Request, Response, NextFunction } from 'express';
import { TypeOfValue, isCheckedTypeValues } from '../../utils/validate';
import { IUserDriversRepository } from '../../Repository/IUserDriversRepository';
import { SendRespone } from '../../services/success/success';
import { UserSchemaProps } from '../../common/common.interface';
import { UserTypeCreate } from '../../common/common.enum';

export class AuthUserMiddleware {
  constructor(private userDriversRepository: IUserDriversRepository) {
    this.validateSignUp = this.validateSignUp.bind(this);
    this.checkAccountExits = this.checkAccountExits.bind(this);
    this.checkTypeAccountChatAppById = this.checkTypeAccountChatAppById.bind(this);
  }

  public async validateSignUp(req: Request, res: Response, next: NextFunction) {
    const { account, passWord, fullName, email } = req.body;
    if (
      !isCheckedTypeValues(account, TypeOfValue.STRING) ||
      !isCheckedTypeValues(passWord, TypeOfValue.STRING) ||
      !isCheckedTypeValues(fullName, TypeOfValue.STRING) ||
      !isCheckedTypeValues(email, TypeOfValue.STRING)
    ) {
      return new SendRespone({
        status: 'error',
        code: 404,
        message: 'Please input full information.'
      }).send(res);
    }
    if (!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
      return new SendRespone({
        status: 'error',
        code: 404,
        message: 'Please input correct type email.'
      }).send(res);
    }
    if (account.length <= 4 && account.length >= 30) {
      return new SendRespone({
        status: 'error',
        code: 404,
        message: 'length number form 6 => 30'
      }).send(res);
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

  public async checkTypeAccountChatAppById(req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
      return new SendRespone({ status: 'error', code: 404, message: 'account not found.' }).send(res);
    }
    const user: UserSchemaProps = req.user;
    const data = await this.userDriversRepository.findById(user._id as string);
    if (data.userTypeCreate === UserTypeCreate.CHATAPP) {
      next();
    } else {
      return new SendRespone({
        status: 'error',
        code: 404,
        message: 'your has do not register password with chatapp, please forgot password and set password.'
      }).send(res);
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
