import { AuthenticatorSchemaProps } from "../models/authenticatorModel";


export interface IAuthenticatorStationDriversRepository {

    createAutCode(userId: string): Promise<string>;

    findByUserId(userId: string): Promise<AuthenticatorSchemaProps>;

    updateAuthCode(userId: string): Promise<string>;

    findAuthCode(authCode: string): Promise<Map<boolean, AuthenticatorSchemaProps>>;
}