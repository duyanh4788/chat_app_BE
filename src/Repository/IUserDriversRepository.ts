
import { UserSchemaProps, UserTypeCreate } from '../models/userModel';

export interface IUserDriversRepository {
    findAllLists(): Promise<UserSchemaProps[]>;

    findById(id: string): Promise<UserSchemaProps | undefined>;

    getUserByIdNoneStatus(id: string): Promise<UserSchemaProps | undefined>;

    findByEmail(email: string): Promise<UserSchemaProps | undefined>;

    findByAccount(account: string): Promise<UserSchemaProps | undefined>;

    createUser(account: string, passWord: string, fullName: string, email: string, statusCreate: string, userTypeCreate: UserTypeCreate, userTypeCreateId?: string, avatar?: string): Promise<UserSchemaProps>;

    updateStatus(id: string, isOnline: boolean): Promise<boolean>;

    updateInfo(body: UserSchemaProps): Promise<boolean>;

    updateStatusCreate(userId: string, statusCreate: string): Promise<void>;
}