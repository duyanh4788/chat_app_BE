import { UserSchemaProps } from '../common/common.interface';

export interface INodeMailerServices {
  sendWelcomeUserNotification(user: UserSchemaProps, authCode: string): Promise<void>;

  sendAuthCodeResetPassWord(user: UserSchemaProps, authCode: string): Promise<void>;

  sendOverLoadSystem(memory: number, numberConectDb: number): Promise<void>;
}
