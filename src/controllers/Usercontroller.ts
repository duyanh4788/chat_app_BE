import { Request, Response } from 'express';
import { RestError } from '../services/error/error';
import { UserUseCase } from '../usecase/UserUseCase';
import { AuthenticatorUseCase } from '../usecase/AuthenticatorUseCase';
import { StatusCreate, Type2FA, UserSchemaProps } from '../models/userModel';
import { checkTimerAuthenticator } from '../utils/timer';
import { validateObjectReqBody } from '../utils/validate';
import * as mongoDB from 'mongodb';
import { nodeMailerServices } from '../services/nodemailer/MailServices';
import { SendRespone } from '../services/success/success';
import { redisController } from '../redis/RedisController';
import { ModelRedis } from '../common/common.constants';

export class UsersController {
  constructor(
    private userUseCase: UserUseCase,
    private authenticatorUseCase: AuthenticatorUseCase,
    private readonly URL_FB: string = 'https://www.facebook.com/v16.0/dialog/oauth',
    private readonly URL_GG: string = 'https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?response_type=code'
  ) {
    this.getListUser = this.getListUser.bind(this);
    this.getUserById = this.getUserById.bind(this);
    this.userSignUp = this.userSignUp.bind(this);
    this.activeUser = this.activeUser.bind(this);
    this.userSignIn = this.userSignIn.bind(this);
    this.userSignInWithCode = this.userSignInWithCode.bind(this);
    this.changeStatusOnline = this.changeStatusOnline.bind(this);
    this.changeStatusOffline = this.changeStatusOffline.bind(this);
    this.updateInfo = this.updateInfo.bind(this);
    this.profileFacebook = this.profileFacebook.bind(this);
    this.profileGoogle = this.profileGoogle.bind(this);
    this.userSignUpWithFB = this.userSignUpWithFB.bind(this);
    this.userSignUpWithGG = this.userSignUpWithGG.bind(this);
    this.orderResetPassWord = this.orderResetPassWord.bind(this);
    this.resendOrderResetPassWord = this.resendOrderResetPassWord.bind(this);
    this.resetPassWord = this.resetPassWord.bind(this);
  }

  public async getListUser(req: Request, res: Response) {
    try {
      const listUsers = await this.userUseCase.getListUser();
      return new SendRespone({ data: listUsers }).send(res);
    } catch (error) {
      return RestError.manageServerError(res, error, false);
    }
  }

  public async getUserById(req: Request, res: Response) {
    try {
      // const userRedis = await redisController.getRedis({ keyModel: ModelRedis.USERS_GETBYID, keyValue: req.params.id });
      // if (userRedis) {
      //   return new SendRespone({ data: userRedis }).send(res);
      // }
      const user = await this.userUseCase.getUserById(req.params.id);
      if (!user) {
        throw new RestError('USER NOT FOUND!', 400);
      }
      // await redisController.setRedis({ keyModel: ModelRedis.USERS_GETBYID, keyValue: req.params.id, value: user });
      return new SendRespone({ data: user }).send(res);
    } catch (error) {
      return RestError.manageServerError(res, error, false);
    }
  }

  public async userSignUp(req: Request, res: Response) {
    try {
      const { account, passWord, fullName, email } = req.body;
      const create = await this.userUseCase.userSignUp(account, passWord, fullName, email);
      if (!create) throw new RestError('Sign Up failed', 400);
      const authCode = await this.authenticatorUseCase.createAuthCode(create._id as string);
      nodeMailerServices.sendWelcomeUserNotification(create, authCode);
      return new SendRespone({
        message: 'sign up successfully, please check email or spam and active account.'
      }).send(res);
    } catch (error) {
      return RestError.manageServerError(res, error, false);
    }
  }

  public async activeUser(req: Request, res: Response) {
    try {
      const { authCode } = req.params;
      if (!authCode) throw new RestError('code invalid.', 401);
      const checkCode = await this.authenticatorUseCase.findAuthCode(authCode);
      for (let [key, value] of checkCode.entries()) {
        if (key) {
          await this.userUseCase.updateStatusCreate(value.userId as string, StatusCreate.ACTIVE);
          return new SendRespone({ message: 'active successfully, please login.' }).send(res);
        }
        if (!key) {
          const findUser = await this.userUseCase.getUserByIdNoneStatus(value.userId as string);
          nodeMailerServices.sendWelcomeUserNotification(findUser, authCode);
          return new SendRespone({
            message: 'your code is expired, we have send code to email, please checked in email and activate.'
          }).send(res);
        }
      }
    } catch (error) {
      return RestError.manageServerError(res, error, false);
    }
  }

  public async userSignUpWithFB(req: Request, res: Response) {
    try {
      return new SendRespone({
        data: `${this.URL_FB}?client_id=${process.env.FB_ID}&redirect_uri=${process.env.END_POINT_SERVER}/users/callback-fb`
      }).send(res);
    } catch (error) {
      return RestError.manageServerError(res, error, false);
    }
  }

  public async userSignUpWithGG(req: Request, res: Response) {
    try {
      return new SendRespone({
        data: `${this.URL_GG}&redirect_uri=${process.env.END_POINT_SERVER}/users/callback-gg&scope=profile email&client_id=${process.env.GG_ID}`
      }).send(res);
    } catch (error) {
      return RestError.manageServerError(res, error, false);
    }
  }

  public async userSignIn(req: Request, res: Response) {
    try {
      const { account, passWord } = req.body;
      const userSignIn = await this.userUseCase.userSignIn(account, passWord);
      if (!userSignIn) throw new RestError('login failed', 400);
      if (userSignIn.twoFa) {
        if (userSignIn.type2FA === Type2FA.AUTH_CODE) {
          const authCode = await this.authenticatorUseCase.handleAuthentionByLogin(userSignIn._id as string);
          if (!authCode) {
            return new SendRespone({
              code: 202,
              message: 'we have send authenticator code to email, please checked to email or try again after 1 hour.'
            }).send(res);
          }
          nodeMailerServices.sendAuthCodeForLogin(userSignIn, authCode as string);
          return new SendRespone({ code: 201, message: 'authentica has send to email, please get code and login.' }).send(res);
        }
      }
      return new SendRespone({ data: userSignIn, message: 'login successfuly' }).send(res);
    } catch (error) {
      return RestError.manageServerError(res, error, false);
    }
  }

  public async userSignInWithCode(req: Request, res: Response) {
    try {
      const { authCode } = req.body;
      if (!authCode || authCode.length !== 6 || typeof authCode !== 'string') throw new RestError('code invalid.', 404);
      const userId = await this.authenticatorUseCase.findAuthCodeAndRemove(authCode as string);
      const userInfo = await this.userUseCase.userSignInWithToken(userId);
      return new SendRespone({ code: 200, data: userInfo, message: 'login successfully.' }).send(res);
    } catch (error) {
      return RestError.manageServerError(res, error, false);
    }
  }

  public async userSignInWithApp(req: Request, res: Response) {
    try {
      const { otp } = req.body;
      if (!otp || otp.length !== 6 || typeof otp !== 'string') throw new RestError('otp invalid.', 404);
      const user = await this.checkUserByEmail(req);
      await this.authenticatorUseCase.pairAuth(user._id as string, otp);
      const userInfo = await this.userUseCase.userSignInWithToken(user._id as string);
      return new SendRespone({ code: 200, data: userInfo, message: 'login successfully.' }).send(res);
    } catch (error) {
      return RestError.manageServerError(res, error, false);
    }
  }

  public async changeStatusOnline(req: Request, res: Response) {
    try {
      const update = await this.userUseCase.changeStatus(req.body.id, true);
      if (!update) throw new RestError('Update status failed', 400);
      return new SendRespone({ message: 'update status successfuly' }).send(res);
    } catch (error) {
      return RestError.manageServerError(res, error, false);
    }
  }

  public async changeStatusOffline(req: Request, res: Response) {
    try {
      const update = await this.userUseCase.changeStatus(req.body.id, false);
      if (!update) throw new RestError('Update status failed', 400);
      return new SendRespone({ message: 'update status successfuly' }).send(res);
    } catch (error) {
      return RestError.manageServerError(res, error, false);
    }
  }

  public async updateInfo(req: Request, res: Response) {
    try {
      const update = await this.userUseCase.updateInfo(req.body);
      if (!update) throw new RestError('Update status failed', 400);
      return new SendRespone({ message: 'update successfuly' }).send(res);
    } catch (error) {
      return RestError.manageServerError(res, error, false);
    }
  }

  public async profileFacebook(req: Request, res: Response) {
    try {
      if (!req.isAuthenticated() || !req.user) {
        return new SendRespone({ data: process.env.END_POINT_HOME }).redirect(res);
      }
      const create = await this.userUseCase.profileFacebook(req.user);
      if (!create) {
        return new SendRespone({ data: process.env.END_POINT_HOME }).redirect(res);
      }
      return new SendRespone({
        data: `${process.env.END_POINT_HOME}/?token=${create.toKen}?_id=${create._id}`
      }).redirect(res);
    } catch (error) {
      return new SendRespone({ data: process.env.END_POINT_HOME }).redirect(res);
    }
  }

  public async profileGoogle(req: Request, res: Response) {
    try {
      if (!req.isAuthenticated() || !req.user) {
        return new SendRespone({ data: process.env.END_POINT_HOME }).redirect(res);
      }
      const create = await this.userUseCase.profileGoogle(req.user);
      if (!create) {
        return new SendRespone({ data: process.env.END_POINT_HOME }).redirect(res);
      }
      return new SendRespone({
        data: `${process.env.END_POINT_HOME}/?token=${create.toKen}?_id=${create._id}`
      }).redirect(res);
    } catch (error) {
      return new SendRespone({ data: process.env.END_POINT_HOME }).redirect(res);
    }
  }

  public async orderResetPassWord(req: Request, res: Response) {
    try {
      const user = await this.checkUserByEmail(req);
      const findCode = await this.authenticatorUseCase.findByUserId(user._id as string);
      if (findCode)
        return new SendRespone({
          message: 'we have send authenticator code to email, please checked to email or resend order code.'
        }).send(res);
      const authCode = await this.authenticatorUseCase.createAuthCode(user._id as string);
      nodeMailerServices.sendAuthCodeResetPassWord(user, authCode);
      return new SendRespone({ message: 'we have send authenticator code to email.' }).send(res);
    } catch (error) {
      return RestError.manageServerError(res, error, false);
    }
  }

  public async resendOrderResetPassWord(req: Request, res: Response) {
    try {
      const user = await this.checkUserByEmail(req);
      const findCode = await this.authenticatorUseCase.findByUserId(user._id as string);
      if (!findCode) {
        throw new RestError('you can not order reset password', 404);
      }
      const checkTime = checkTimerAuthenticator(findCode.dateTimeCreate);
      if (!checkTime)
        return new SendRespone({
          message: 'we have send authenticator code to email, please checked to email or try again after 1 hour.'
        }).send(res);
      const authCode = await this.authenticatorUseCase.updateAuthCode(user._id as string);
      nodeMailerServices.sendAuthCodeResetPassWord(user, authCode);
      return new SendRespone({ message: 'we have send authenticator code to email.' }).send(res);
    } catch (error) {
      return RestError.manageServerError(res, error, false);
    }
  }

  public async resetPassWord(req: Request, res: Response) {
    const client = new mongoDB.MongoClient(process.env.DATABASE as string);
    const session = client.startSession();
    session.startTransaction();
    try {
      validateObjectReqBody(req);
      const { authCode, newPassWord } = req.body;
      if (!authCode || !newPassWord) throw new RestError('request not avalible.', 404);
      const user = await this.checkUserByEmail(req);
      await this.authenticatorUseCase.findAuthCodeAndRemove(authCode);
      await this.userUseCase.updatePassWord(user._id as string, newPassWord);
      await session.commitTransaction();
      session.endSession();
      return new SendRespone({ message: 'upadte password successfully.' }).send(res);
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      return RestError.manageServerError(res, error, false);
    }
  }

  public async getAuthPair(req: Request, res: Response) {
    try {
      if (!req.isAuthenticated() || !req.user) {
        throw new RestError('please login.');
      }
      const user: UserSchemaProps = req.user;
      const authpair = await this.authenticatorUseCase.createAuthPair(user._id as string);
      return new SendRespone({ data: authpair, message: 'create authpair successfully.' }).send(res);
    } catch (error) {
      return RestError.manageServerError(res, error, false);
    }
  }

  public async pairAuth(req: Request, res: Response) {
    try {
      if (!req.isAuthenticated() || !req.user) {
        throw new RestError('please login.');
      }
      const user: UserSchemaProps = req.user;
      const { token } = req.body;
      await this.authenticatorUseCase.pairAuth(user._id as string, token);
      return new SendRespone({ message: 'update otp authpair successfully.' }).send(res);
    } catch (error) {
      return RestError.manageServerError(res, error, false);
    }
  }

  private async checkUserByEmail(req: Request): Promise<UserSchemaProps> {
    const { email } = req.body;
    if (!email) throw new RestError('email not avalible.', 404);
    const user = await this.userUseCase.getUserByEmail(email);
    if (user && user.statusCreate === StatusCreate.IN_ACTIVE) {
      throw new RestError('account have inactive, please activate code in email or spam.', 401);
    }
    return user;
  }
}
