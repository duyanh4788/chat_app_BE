import mongoose from "mongoose";
import { TitleModel } from "../common/common.constants";
import { UserSchemaProps } from "../models/userModel";
import { UsersSchema } from '../models/userModel';
import { IUserDriversRepository } from "../Repository/IUserDriversRepository";

export class UserDriversController implements IUserDriversRepository {

    private Users = mongoose.model(TitleModel.USERS, UsersSchema);
    private selectUser = [
        'account',
        'fullName',
        'email',
        'avatar',
        'isOnline',
    ]

    async findAllLists(): Promise<UserSchemaProps[]> {
        const listUsers = await this.Users.find({}).select(this.selectUser);
        return listUsers.map(item => this.transFromData(item))
    }

    async findById(id: string): Promise<UserSchemaProps | undefined> {
        const user = await this.Users.findById(id).select(this.selectUser);
        if (!user) return;
        return this.transFromData(user)
    }

    async findByAccount(account: string): Promise<UserSchemaProps | undefined> {
        const user: any = await this.Users.findOne({ account });
        if (!user) return;
        return this.transFromData(user)
    }

    async createUser(account: string, hashPassWord: string, fullName: string, email: string): Promise<boolean> {
        const newUser = new this.Users({
            account,
            passWord: hashPassWord,
            fullName,
            email,
        });
        await newUser.save();
        return true
    }

    async updateStatus(id: string, isOnline: boolean): Promise<boolean> {
        await this.Users.findByIdAndUpdate(id, {
            isOnline,
        });
        return true;
    }

    async updateStatusSocket(id: string, isOnline: boolean): Promise<void> {
        await this.Users.findByIdAndUpdate(id, {
            isOnline,
        });
        return;
    }

    async updateInfo(body: UserSchemaProps): Promise<boolean> {
        const { _id, fullName, avatar } = body
        await this.Users.findByIdAndUpdate(_id, {
            fullName,
            avatar,
        });
        return true;
    }

    private transFromData(data: any) {
        if (!data) return;
        return data._doc
    }
}