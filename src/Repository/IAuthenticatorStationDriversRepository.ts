import { AuthenticatorSchemaProps } from '../common/common.interface';

export interface IAuthenticatorStationDriversRepository {
  createAuthCode(userId: string): Promise<string>;

  findByUserId(userId: string): Promise<AuthenticatorSchemaProps>;

  updateAuthCode(userId: string): Promise<string>;

  findAuthCode(authCode: string): Promise<Map<boolean, AuthenticatorSchemaProps>>;

  findAuthCodeAndRemove(authCode: string): Promise<string>;
}
