import { IAuthenticatorStationDriversRepository } from "../Repository/IAuthenticatorStationDriversRepository";
import { AuthenticatorSchemaProps } from "../models/authenticatorModel";

export class AuthenticatorUseCase {

    constructor(private authenticatorStationDriversRepository: IAuthenticatorStationDriversRepository) { }

    async createAuthCode(userId: string): Promise<string> {
        const code = await this.authenticatorStationDriversRepository.createAuthCode(userId);
        return code;
    }

    async findByUserId(userId: string): Promise<AuthenticatorSchemaProps> {
        const code = await this.authenticatorStationDriversRepository.findByUserId(userId);
        return code;
    }

    async updateAuthCode(userId: string): Promise<string> {
        const code = await this.authenticatorStationDriversRepository.updateAuthCode(userId);
        return code;
    }

    async findAuthCode(authCode: string): Promise<Map<boolean, AuthenticatorSchemaProps>> {
        return await this.authenticatorStationDriversRepository.findAuthCode(authCode);
    }

    async findAuthCodeAndRemove(authCode: string): Promise<void> {
        return await this.authenticatorStationDriversRepository.findAuthCodeAndRemove(authCode);
    }
}