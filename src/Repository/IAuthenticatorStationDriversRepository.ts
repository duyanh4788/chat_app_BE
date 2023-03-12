import { AuthenticatorSchemaProps } from '../models/authenticatorModel';

export interface IAuthenticatorStationDriversRepository {
  createAuthCode(userId: string): Promise<string>;

  findByUserId(userId: string): Promise<AuthenticatorSchemaProps>;

  updateAuthCode(userId: string): Promise<string>;

  findAuthCode(authCode: string): Promise<Map<boolean, AuthenticatorSchemaProps>>;

  findAuthCodeAndRemove(authCode: string): Promise<void>;
}
