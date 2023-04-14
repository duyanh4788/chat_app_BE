import { IUserDriversRepository } from '../Repository/IUserDriversRepository';
import { RestError } from '../services/error/error';
import * as bcrypt from 'bcryptjs';
import * as JWT from 'jsonwebtoken';
import { SECRETKEY } from '../common/common.constants';
import { UserSchemaProps } from '../common/common.interface';
import { StatusCreate, UserTypeCreate } from '../common/common.enum';
export class UserUseCase {
  constructor(private userDriversController: IUserDriversRepository) {}

  async getListUser(userId: string): Promise<UserSchemaProps[]> {
    return await this.userDriversController.findAllLists(userId);
  }

  async userSignInWithToken(userId: string): Promise<UserSchemaProps> {
    const user = await this.getUserById(userId);
    return this.configHashPass(user);
  }

  async getUserById(id: string): Promise<UserSchemaProps> {
    const user = await this.userDriversController.findById(id);
    if (!user) {
      throw new RestError('USER NOT FOUND!', 400);
    }
    return user;
  }

  async getUserByEmail(email: string): Promise<UserSchemaProps> {
    const user = await this.userDriversController.findByEmail(email);
    if (!user) {
      throw new RestError('USER NOT FOUND!', 400);
    }
    return user;
  }

  async getUserByIdNoneStatus(id: string): Promise<UserSchemaProps> {
    const user = await this.userDriversController.getUserByIdNoneStatus(id);
    if (!user) {
      throw new RestError('USER NOT FOUND!', 400);
    }
    return user;
  }

  async userSignUp(account: string, passWord: string, fullName: string, email: string): Promise<UserSchemaProps> {
    const salt = bcrypt.genSaltSync(10);
    const hashPassWord = bcrypt.hashSync(passWord, salt);
    const create = await this.userDriversController.createUser(
      account,
      hashPassWord,
      fullName,
      email,
      StatusCreate.IN_ACTIVE,
      UserTypeCreate.CHATAPP
    );
    if (!create) throw new RestError('Signup failed, please contact admin', 400);
    return create;
  }

  async userSignIn(account: string, passWord: string) {
    const checkAccount: any = await this.userDriversController.findByAccount(account);
    if (!checkAccount) throw new RestError('Account not found, pleas sign up.', 400);

    if (checkAccount.passWord === '') throw new RestError(`you have login to ${checkAccount.userTypeCreate}, please login with by app`, 400);
    const checkPassWord = bcrypt.compareSync(passWord, checkAccount.passWord);
    if (!checkPassWord) throw new RestError('Password is wrong.', 400);
    return this.configHashPass(checkAccount);
  }

  async changeStatus(id: string, isOnline: boolean): Promise<boolean> {
    const user = await this.userDriversController.findById(id);
    if (!user) {
      throw new RestError('USER NOT FOUND!', 400);
    }
    const update = await this.userDriversController.updateStatus(id, isOnline);
    if (!update) throw new RestError('Update status failed', 400);
    return true;
  }

  async updateInfo(body: UserSchemaProps): Promise<boolean> {
    const update = await this.userDriversController.updateInfo(body);
    return update;
  }

  async updateTwoFAByApp(userId: string): Promise<void> {
    return await this.userDriversController.updateTwoFAByApp(userId);
  }

  async updatePassWord(userId: string, newPassWord: string): Promise<void> {
    const salt = bcrypt.genSaltSync(10);
    const hashPassWord = bcrypt.hashSync(newPassWord, salt);
    return await this.userDriversController.updatePassWord(userId, hashPassWord);
  }

  async profileFacebook(body: UserSchemaProps) {
    if (!body) return;
    return this.configHashPass(body);
  }

  async profileGoogle(body: UserSchemaProps) {
    if (!body) return;
    return this.configHashPass(body);
  }

  async updateStatusCreate(userId: string, statusCreate: string): Promise<void> {
    return await this.userDriversController.updateStatusCreate(userId, statusCreate);
  }

  private configHashPass(user: UserSchemaProps) {
    const header = {
      _id: user._id,
      account: user.account,
      userTypeCode: user.userTypeCode
    };
    const toKen = JWT.sign(header, SECRETKEY, { expiresIn: 86400 }); // 1 day
    const infoUser = {
      _id: user._id,
      account: user.account,
      fullName: user.fullName,
      email: user.email,
      avatar: user.avatar,
      isOnline: user.isOnline,
      twofa: user.twofa,
      type2FA: user.type2FA,
      userTypeCode: user.userTypeCode,
      toKen
    };
    return infoUser;
  }
}
