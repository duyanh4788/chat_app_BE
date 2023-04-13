import mongoose from 'mongoose';
import * as authenticator from 'authenticator';
import { TitleModel } from '../common/common.constants';
import { RestError } from '../services/error/error';
import { AuthenticatorAppSchema } from '../models/authenticatorAppModel';
import { IAuthenticatorAppStationDriversRepository } from '../Repository/IAuthenticatorAppStationDriversRepository';

export class AuthenticatorAppStationDriversController implements IAuthenticatorAppStationDriversRepository {
  private Authenticators = mongoose.model(TitleModel.AUTHENTICATOR_APP, AuthenticatorAppSchema);

  async createAuthPair(userId: string): Promise<string> {
    const auth = await this.Authenticators.findOne({ userId });
    if (auth) return this.generateAuthKey(auth.authKey as string);
    const authModel = new this.Authenticators({
      userId,
      authKey: authenticator.generateKey(),
      dateTimeCreate: new Date()
    });
    await authModel.save();
    return this.generateAuthKey(authModel.authKey as string);
  }

  async pairAuth(userId: string, token: string): Promise<void> {
    const auth = await this.Authenticators.findOne({ userId });
    if (!auth) throw new RestError('token invalid.', 401);
    const veryfi = authenticator.verifyToken(auth.authKey as string, token);
    if (!veryfi) throw new RestError('OTP token invalid.', 401);
    return;
  }

  private transFromData(data: any) {
    if (!data) return;
    return data._doc;

  }

  private generateAuthKey(authKey: string): string {
    return authenticator.generateTotpUri(authKey, '', 'ChatApp', 'SHA1', 6, 30);
  }
}
