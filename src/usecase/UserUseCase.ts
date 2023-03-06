import { UserSchemaProps } from "../models/userModel";
import { IUserDriversRepository } from "../Repository/IUserDriversRepository";
import { RestError } from "../services/error/error";
import * as bcrypt from 'bcryptjs';
import * as JWT from 'jsonwebtoken';
import { SECRETKEY } from "../common/common.constants";

export class UserUseCase {

    constructor(private userDriversController: IUserDriversRepository) { }

    async getListUser(): Promise<UserSchemaProps[]> {
        const listUsers = await this.userDriversController.findAllLists();
        if (listUsers && !listUsers.length) {
            throw new RestError('DATA NOT FOUND!', 400)
        }
        return listUsers
    }

    async getUserById(id: string): Promise<UserSchemaProps> {
        const user = await this.userDriversController.findById(id);
        if (!user) {
            throw new RestError('USER NOT FOUND!', 400)
        }
        return user
    }

    async userSignUp(account: string, passWord: string, fullName: string, email: string): Promise<boolean> {
        const salt = bcrypt.genSaltSync(10);
        const hashPassWord = bcrypt.hashSync(passWord, salt);
        const create = await this.userDriversController.createUser(account, hashPassWord, fullName, email);
        if (!create) throw new RestError('Signup failed, please contact admin', 400)
        return create
    }

    async userSignIn(account: string, passWord: string) {
        const checkAccount: any = await this.userDriversController.findByAccount(account)
        if (!checkAccount) throw new RestError('Account not found, pleas sign up.', 400)
        const checkPassWord = bcrypt.compareSync(passWord, checkAccount.passWord);
        if (!checkPassWord) throw new RestError('Password is wrong.', 400)
        const header = {
            _id: checkAccount.id,
            account: checkAccount.account,
            userTypeCode: checkAccount.userTypeCode,
        };
        const toKen = JWT.sign(header, SECRETKEY, { expiresIn: 86400000 });
        const infoUser = {
            _id: checkAccount.id,
            account: checkAccount.account,
            fullName: checkAccount.fullName,
            email: checkAccount.email,
            avatar: checkAccount.avatar,
            isOnline: checkAccount.isOnline,
            userTypeCode: checkAccount.userTypeCode,
            toKen,
        };
        return infoUser
    }

    async changeStatus(id: string, isOnline: boolean): Promise<boolean> {
        const user = await this.userDriversController.findById(id);
        if (!user) {
            throw new RestError('USER NOT FOUND!', 400)
        }
        const update = await this.userDriversController.updateStatus(id, isOnline);
        if (!update) throw new RestError('Update status failed', 400);
        return true
    }
}