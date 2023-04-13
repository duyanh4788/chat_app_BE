import { IAuthenticatorAppStationDriversRepository } from '../Repository/IAuthenticatorAppStationDriversRepository';
import { IAuthenticatorStationDriversRepository } from '../Repository/IAuthenticatorStationDriversRepository';
import { AuthenticatorSchemaProps } from '../common/common.interface';
import { checkTimerAuthenticator } from '../utils/timer';

export class AuthenticatorUseCase {
  constructor(
    private authenticatorStationDriversRepository: IAuthenticatorStationDriversRepository,
    private authenticatorAppStationDriversRepository: IAuthenticatorAppStationDriversRepository
  ) { }

  async handleAuthentionByLogin(userId: string): Promise<string | boolean> {
    const find = await this.findByUserId(userId);
    if (!find) return this.createAuthCode(userId);
    const checkTime = checkTimerAuthenticator(find.dateTimeCreate);
    if (checkTime) {
      return this.updateAuthCode(userId);
    }
    return false;
  }

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

  async findAuthCodeAndRemove(authCode: string): Promise<string> {
    return await this.authenticatorStationDriversRepository.findAuthCodeAndRemove(authCode);
  }

  // App

  async createAuthPair(userId: string): Promise<string> {
    return await this.authenticatorAppStationDriversRepository.createAuthPair(userId);
  }

  async pairAuth(userId: string, token: string): Promise<void> {
    return await this.authenticatorAppStationDriversRepository.pairAuth(userId, token);
  }
}
