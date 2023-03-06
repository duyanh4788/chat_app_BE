
import { UserSchemaProps } from '../models/userModel';

export interface IUserDriversRepository {
    findAllLists(): Promise<UserSchemaProps[]>;

    findById(id: string): Promise<UserSchemaProps | undefined>;

    findByAccount(account: string): Promise<UserSchemaProps | undefined>;

    createUser(account: string, passWord: string, fullName: string, email: string): Promise<boolean>;

    updateStatus(id: string, isOnline: boolean): Promise<boolean>;
}