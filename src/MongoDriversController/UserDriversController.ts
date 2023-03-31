import mongoose from 'mongoose';
import { TitleModel } from '../common/common.constants';
import { StatusCreate, UserSchemaProps, UsersSchema, UserTypeCreate } from '../models/userModel';
import { IUserDriversRepository } from '../Repository/IUserDriversRepository';
import { RestError } from '../services/error/error';

export class UserDriversController implements IUserDriversRepository {
  private Users = mongoose.model(TitleModel.USERS, UsersSchema);
  private selectUser = [
    'account',
    'fullName',
    'email',
    'avatar',
    'isOnline',
    'statusCreate',
    'twoFA',
    'type2FA'
  ];

  async findAllLists(): Promise<UserSchemaProps[]> {
    const listUsers = await this.Users.find({ statusCreate: StatusCreate.ACTIVE }).select(
      this.selectUser
    );
    return listUsers.map((item) => this.transFromData(item));
  }

  async findById(id: string): Promise<UserSchemaProps | undefined> {
    const user = await this.Users.findById(id).select(this.selectUser);
    if (!user) return;
    if (user && user.statusCreate === StatusCreate.IN_ACTIVE) {
      throw new RestError(
        'account have inactive, please activate code in email or spam.',
        401
      );
    }
    return this.transFromData(user);
  }

  async getUserByIdNoneStatus(id: string): Promise<UserSchemaProps | undefined> {
    const user = await this.Users.findById(id).select(this.selectUser);
    if (!user) return;
    return this.transFromData(user);
  }

  async findByAccount(account: string): Promise<UserSchemaProps | undefined> {
    const user: any = await this.Users.findOne({ account });
    if (!user) return;
    if (user && user.statusCreate === StatusCreate.IN_ACTIVE) {
      throw new RestError(
        'account have inactive, please activate code in email or spam.',
        401
      );
    }
    return this.transFromData(user);
  }

  async findByEmail(email: string): Promise<UserSchemaProps | undefined> {
    const user: any = await this.Users.findOne({ email });
    if (!user) return;
    if (user && user.statusCreate === StatusCreate.IN_ACTIVE) {
      throw new RestError(
        'account have inactive, please activate code in email or spam.',
        401
      );
    }
    return this.transFromData(user);
  }

  async createUser(
    account: string,
    hashPassWord: string,
    fullName: string,
    email: string,
    statusCreate: string,
    userTypeCreate: UserTypeCreate,
    userTypeCreateId: string = '',
    avatar: string = ''
  ): Promise<UserSchemaProps> {
    const newUser = new this.Users({
      account,
      passWord: hashPassWord,
      fullName,
      email,
      avatar,
      userTypeCreate,
      userTypeCreateId,
      statusCreate
    });
    const create = await newUser.save();
    return this.transFromData(create);
  }

  async updateStatus(id: string, isOnline: boolean): Promise<boolean> {
    await this.Users.findByIdAndUpdate(id, {
      isOnline
    });
    return true;
  }

  async updateStatusSocket(id: string, isOnline: boolean): Promise<void> {
    await this.Users.findByIdAndUpdate(id, {
      isOnline
    });
    return;
  }

  async updateInfo(body: UserSchemaProps): Promise<boolean> {
    const { _id, fullName, avatar, twoFA, type2FA } = body;
    await this.Users.findByIdAndUpdate(_id, {
      fullName,
      avatar,
      twoFA: !!twoFA,
      type2FA
    });
    return true;
  }

  async updateStatusCreate(userId: string, statusCreate: string): Promise<void> {
    await this.Users.findByIdAndUpdate(userId, {
      statusCreate
    });
    return;
  }

  async updatePassWord(userId: string, newPassWord: string): Promise<void> {
    await this.Users.findByIdAndUpdate(userId, {
      passWord: newPassWord
    });
    return;
  }

  private transFromData(data: any) {
    if (!data) return;
    return data._doc;
  }
}
