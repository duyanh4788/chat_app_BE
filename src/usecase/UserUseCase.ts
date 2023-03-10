import { UserSchemaProps, UserTypeCreate } from "../models/userModel";
import { IUserDriversRepository } from "../Repository/IUserDriversRepository";
import { RestError } from "../services/error/error";
import * as bcrypt from 'bcryptjs';
import * as JWT from 'jsonwebtoken';
import { SECRETKEY } from "../common/common.constants";
import { FaceBookService } from "../services/facebook/FaceBookServices";

export class UserUseCase {

    constructor(private userDriversController: IUserDriversRepository, private faceBookService: FaceBookService) { }

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
        const create = await this.userDriversController.createUser(account, hashPassWord, fullName, email, UserTypeCreate.CHATAPP);
        if (!create) throw new RestError('Signup failed, please contact admin', 400)
        return create
    }

    async userSignUpWithFB(account: string, token: string, fullName: string, email: string) {
        const findEmail = await this.userDriversController.findByEmail(email);
        if (findEmail) return this.configHashPass(findEmail);
        const create = await this.userDriversController.createUser(account, token, fullName, email, UserTypeCreate.FACEBOOK);
        if (!create) throw new RestError('Signup failed, please contact admin', 400)
        return this.configHashPass(create)
    }

    async userSignIn(account: string, passWord: string) {
        const checkAccount: any = await this.userDriversController.findByAccount(account)
        if (!checkAccount) throw new RestError('Account not found, pleas sign up.', 400)
        const checkPassWord = bcrypt.compareSync(passWord, checkAccount.passWord);
        if (!checkPassWord) throw new RestError('Password is wrong.', 400)
        return this.configHashPass(checkAccount)
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

    async updateInfo(body: UserSchemaProps): Promise<boolean> {
        const update = await this.userDriversController.updateInfo(body)
        return update
    }

    async profileFacebook(body: UserSchemaProps) {
        if (!body) return;
        return this.configHashPass(body)
    }

    private configHashPass(user: UserSchemaProps) {
        const header = {
            _id: user._id,
            account: user.account,
            userTypeCode: user.userTypeCode,
        };
        const toKen = JWT.sign(header, SECRETKEY, { expiresIn: 86400000 });
        const infoUser = {
            _id: user._id,
            account: user.account,
            fullName: user.fullName,
            email: user.email,
            avatar: user.avatar,
            isOnline: user.isOnline,
            userTypeCode: user.userTypeCode,
            toKen,
        };
        return infoUser
    }
}