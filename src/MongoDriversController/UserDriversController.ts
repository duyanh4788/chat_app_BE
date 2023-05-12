import mongoose from 'mongoose';
import { TitleModel } from '../common/common.constants';
import { UsersSchema } from '../models/userModel';
import { IUserDriversRepository } from '../Repository/IUserDriversRepository';
import { RestError } from '../services/error/error';
import { redisController } from '../redis/RedisController';
import { UserSchemaProps } from '../common/common.interface';
import { StatusCreate, Type2FA, UserTypeCreate } from '../common/common.enum';

export class UserDriversController implements IUserDriversRepository {
  private Users = mongoose.model(TitleModel.USERS, UsersSchema);
  private selectUser = ['account', 'fullName', 'email', 'avatar', 'isOnline', 'userTypeCode', 'userTypeCreate', 'statusCreate', 'twofa', 'type2FA'];

  async findById(id: string): Promise<UserSchemaProps> {
    const user = await this.Users.findById(id).select(this.selectUser).lean(0).cache({ key: id });
    return this.transFromData(user);
  }

  async findAllLists(userId: string): Promise<UserSchemaProps[]> {
    const listUsers = await this.Users.find({ statusCreate: StatusCreate.ACTIVE }).select(this.selectUser).lean(0).cache({ key: userId });
    return listUsers.map((item: UserSchemaProps) => this.transFromData(item));
  }

  async getUserByIdNoneStatus(id: string): Promise<UserSchemaProps | undefined> {
    const user = await this.Users.findById(id).select(this.selectUser).lean(0).cache({ key: id });
    return this.transFromData(user);
  }

  async findByAccount(account: string): Promise<UserSchemaProps | undefined> {
    const user: any = await this.Users.findOne({ account }).lean(0).cache({ key: account });
    if (!user) return;
    if (user && user.statusCreate === StatusCreate.IN_ACTIVE) {
      throw new RestError('account have inactive, please activate code in email or spam.', 401);
    }
    return this.transFromData(user);
  }

  async findByEmail(email: string): Promise<UserSchemaProps | undefined> {
    const user: any = await this.Users.findOne({ email }).lean(0).cache({ key: email });
    if (user && user.statusCreate === StatusCreate.IN_ACTIVE) {
      throw new RestError('account have inactive, please activate code in email or spam.', 401);
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
    await redisController.clearHashRedis(id as string);
    return true;
  }

  async updateStatusSocket(id: string, isOnline: boolean): Promise<void> {
    await this.Users.findByIdAndUpdate(id, {
      isOnline
    });
    await redisController.clearHashRedis(id as string);
    return;
  }

  async updateInfo(body: UserSchemaProps): Promise<boolean> {
    const { _id, fullName, avatar, twofa, type2FA } = body;
    const user = await this.Users.findByIdAndUpdate(_id, {
      fullName,
      avatar,
      twofa: !!twofa,
      type2FA
    });
    await redisController.clearHashRedis(_id as string);
    await redisController.clearHashRedis(user?.account as string);
    await redisController.clearHashRedis(user?.email as string);
    return true;
  }

  async updateTwoFAByApp(userId: string): Promise<void> {
    await this.Users.findByIdAndUpdate(userId, {
      twofa: true,
      type2FA: Type2FA.PASSPORT
    });
    await redisController.clearHashRedis(userId as string);
    return;
  }

  async updateStatusCreate(userId: string, statusCreate: string): Promise<void> {
    await this.Users.findByIdAndUpdate(userId, {
      statusCreate
    });
    await redisController.clearHashRedis(userId);
    return;
  }

  async updatePassWord(userId: string, newPassWord: string): Promise<void> {
    await this.Users.findByIdAndUpdate(userId, {
      passWord: newPassWord
    });
    await redisController.clearHashRedis(userId);
    return;
  }

  async searchUsers(query: string): Promise<UserSchemaProps[]> {
    // const listUsers = await this.Users.find({
    //   $or: [{ name: { $regex: query, $options: 'i' } }, { email: { $regex: query, $options: 'i' } }]
    // });
    // return listUsers.map((item: UserSchemaProps) => this.transFromData(item));

    const listUsers = await this.Users.aggregate([
      {
        $match: {
          $or: [{ name: { $regex: query, $options: 'i' } }, { email: { $regex: query, $options: 'i' } }]
        }
      },
      {
        $lookup: {
          from: 'friends',
          let: { userId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ['$userId', '$$userId'] }]
                }
              }
            }
          ],
          as: 'friends'
        }
      },
      {
        $project: {
          _id: 1,
          account: 1,
          fullName: 1,
          email: 1,
          avatar: 1,
          friends: { $cond: [{ $ne: ['$friends', []] }, true, false] }
        }
      }
    ]);

    return listUsers.filter((item) => !item.friends);
  }

  private transFromData(data: any) {
    if (!data) return;
    return data._doc;
  }
}
