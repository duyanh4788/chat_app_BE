import { UserTypeCreate } from '../common/common.enum';
import { UserSchemaProps } from '../common/common.interface';

export interface IUserDriversRepository {
  findAllLists(userId: string): Promise<UserSchemaProps[]>;

  findById(id: string): Promise<UserSchemaProps>;

  getUserByIdNoneStatus(id: string): Promise<UserSchemaProps | undefined>;

  findByEmail(email: string): Promise<UserSchemaProps | undefined>;

  findByAccount(account: string): Promise<UserSchemaProps | undefined>;

  createUser(
    account: string,
    passWord: string,
    fullName: string,
    email: string,
    statusCreate: string,
    userTypeCreate: UserTypeCreate,
    userTypeCreateId?: string,
    avatar?: string
  ): Promise<UserSchemaProps>;

  updateStatus(id: string, isOnline: boolean): Promise<boolean>;

  updateInfo(body: UserSchemaProps): Promise<boolean>;

  updateTwoFAByApp(userId: string): Promise<void>;

  updateStatusCreate(userId: string, statusCreate: string): Promise<void>;

  updatePassWord(userId: string, newPassWord: string): Promise<void>;
}
