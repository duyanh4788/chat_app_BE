import mongoose from "mongoose";
import { TitleModel } from "../common/common.constants";
import { AuthenticatorSchema, AuthenticatorSchemaProps } from "../models/authenticatorModel";
import { IAuthenticatorStationDriversRepository } from "../Repository/IAuthenticatorStationDriversRepository";
import { RestError } from "../services/error/error";
import { ramdomAuthCode } from "../utils/ramdomAuthCode";

export class AuthenticatorStationDriversController implements IAuthenticatorStationDriversRepository {
    private Authenticators = mongoose.model(TitleModel.AUTHENTICATOR, AuthenticatorSchema);

    async createAutCode(userId: string): Promise<string> {
        const authCode = ramdomAuthCode(6);
        const model = new this.Authenticators({
            userId,
            authCode,
            dateTimeCreate: new Date()
        })
        await model.save()
        return authCode;
    }

    async findByUserId(userId: string): Promise<AuthenticatorSchemaProps> {
        const code = await this.Authenticators.find({ userId });
        return this.transFromData(code)
    }

    async updateAuthCode(userId: string): Promise<string> {
        const authCode = ramdomAuthCode(6);
        await this.Authenticators.findOneAndUpdate(
            { userId: userId },
            { authCode: authCode },
            { new: true }
        )
        return authCode
    }

    async findAuthCode(authCode: string): Promise<Map<boolean, AuthenticatorSchemaProps>> {
        let findCode = await this.Authenticators.findOne({ authCode })
        if (!findCode) throw new RestError('code invalid.', 401)
        let mapAuthCode: Map<boolean, AuthenticatorSchemaProps> = new Map();
        const checkTime = new Date(findCode.dateTimeCreate).getTime() < new Date().getTime() - 3600000;
        if (checkTime) {
            const authCode = ramdomAuthCode(6);
            findCode.authCode = authCode;
            findCode.dateTimeCreate = new Date();
            await findCode.save()
            mapAuthCode.set(false, this.transFromData(findCode))
            return mapAuthCode
        }
        await findCode.delete();
        mapAuthCode.set(true, this.transFromData(findCode))
        return mapAuthCode
    }


    private transFromData(data: any) {
        if (!data) return;
        return data._doc
    }
}