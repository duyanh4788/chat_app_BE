import mongoose from "mongoose";
import { TitleModel } from "../common/common.constants";
import { UserSchemaProps } from "../models/userModel";
import { UsersSchema } from '../models/userModel';
import { IUserDriversRepository } from "../Repository/IUserDriversRepository";
import { RestError } from "../services/error/error";


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
        return listUsers
    }

    async findById(id: string): Promise<UserSchemaProps | undefined> {
        const user = await this.Users.findById(id).select(this.selectUser);
        if (!user) return;
        return user
    }

    async findByAccount(account: string): Promise<UserSchemaProps | undefined> {
        const user: any = await this.Users.findOne({ account });
        if (!user) return;
        return user
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
        const user = await this.Users.findById(id);
        if (!user) {
            throw new RestError("User does not exist.", 400);
        }
        await this.Users.findByIdAndUpdate(id, {
            isOnline,
        });
        return true;
    }
}