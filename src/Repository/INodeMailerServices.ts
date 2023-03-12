import { UserSchemaProps } from '../models/userModel';

export interface INodeMailerServices {
  sendWelcomeUserNotification(user: UserSchemaProps, authCode: string): Promise<void>;

  sendAuthCodeResetPassWord(user: UserSchemaProps, authCode: string): Promise<void>;
}
