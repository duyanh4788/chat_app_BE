import { Request, Response } from 'express';
import { RestError } from '../services/error/error';
import { sendRespone } from '../common/common.success';
import { UserUseCase } from '../usecase/UserUseCase';
import { AuthenticatorUseCase } from '../usecase/AuthenticatorUseCase';
import { INodeMailerServices } from '../Repository/INodeMailerServices';
import { StatusCreate, UserSchemaProps } from '../models/userModel';
import { checkTimerAuthenticator } from '../utils/timer';
import { validateObjectReqBody } from '../utils/validate';
const { MongoClient } = require('mongodb');

export class UsersController {
  constructor(
    private userUseCase: UserUseCase,
    private authenticatorUseCase: AuthenticatorUseCase,
    private nodeMailerServicese: INodeMailerServices
  ) {
    this.getListUser = this.getListUser.bind(this);
    this.getUserById = this.getUserById.bind(this);
    this.userSignUp = this.userSignUp.bind(this);
    this.activeUser = this.activeUser.bind(this);
    this.userSignIn = this.userSignIn.bind(this);
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
      if (listUsers && !listUsers.length) {
        throw new RestError('DATA NOT FOUND!', 400);
      }
      return sendRespone(res, 'success', 200, listUsers, '');
    } catch (error) {
      return RestError.manageServerError(res, error, false);
    }
  }

  public async getUserById(req: Request, res: Response) {
    try {
      const user = await this.userUseCase.getUserById(req.params.id);
      if (!user) {
        throw new RestError('USER NOT FOUND!', 400);
      }
      return sendRespone(res, 'success', 200, user, '');
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
      this.nodeMailerServicese.sendWelcomeUserNotification(create, authCode);
      return sendRespone(res, 'success', 200, null, 'sign up successfully.');
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
          return sendRespone(res, 'success', 200, 'active successfully, please login.', '');
        }
        if (!key) {
          const findUser = await this.userUseCase.getUserByIdNoneStatus(value.userId as string);
          this.nodeMailerServicese.sendWelcomeUserNotification(findUser, authCode);
          return sendRespone(
            res,
            'success',
            200,
            'your code is expired, we have send code to email, please checked in email and activate.',
            ''
          );
        }
      }
    } catch (error) {
      return RestError.manageServerError(res, error, false);
    }
  }

  public async userSignUpWithFB(req: Request, res: Response) {
    try {
      return sendRespone(
        res,
        'success',
        200,
        `${process.env.END_POINT_SERVER}/login-fb`,
        'login successfuly'
      );
    } catch (error) {
      return RestError.manageServerError(res, error, false);
    }
  }

  public async userSignUpWithGG(req: Request, res: Response) {
    try {
      return sendRespone(
        res,
        'success',
        200,
        `${process.env.END_POINT_SERVER}/login-gg`,
        'login successfuly'
      );
    } catch (error) {
      return RestError.manageServerError(res, error, false);
    }
  }

  public async userSignIn(req: Request, res: Response) {
    try {
      const { account, passWord } = req.body;
      const userSignIn = await this.userUseCase.userSignIn(account, passWord);
      if (!userSignIn) throw new RestError('login failed', 400);
      return sendRespone(res, 'success', 200, userSignIn, 'login successfuly');
    } catch (error) {
      return RestError.manageServerError(res, error, false);
    }
  }

  public async changeStatusOnline(req: Request, res: Response) {
    try {
      const update = await this.userUseCase.changeStatus(req.body.id, true);
      if (!update) throw new RestError('Update status failed', 400);
      return sendRespone(res, 'success', 200, null, 'update status successfuly');
    } catch (error) {
      return RestError.manageServerError(res, error, false);
    }
  }

  public async changeStatusOffline(req: Request, res: Response) {
    try {
      const update = await this.userUseCase.changeStatus(req.body.id, false);
      if (!update) throw new RestError('Update status failed', 400);
      return sendRespone(res, 'success', 200, null, 'update status successfuly');
    } catch (error) {
      return RestError.manageServerError(res, error, false);
    }
  }

  public async updateInfo(req: Request, res: Response) {
    try {
      const update = await this.userUseCase.updateInfo(req.body);
      if (!update) throw new RestError('Update status failed', 400);
      return sendRespone(res, 'success', 200, null, 'update successfuly');
    } catch (error) {
      return RestError.manageServerError(res, error, false);
    }
  }

  public async profileFacebook(req: Request, res: Response) {
    try {
      if (!req.isAuthenticated() || !req.user) {
        return res.redirect(process.env.END_POINT_HOME as string);
      }
      const create = await this.userUseCase.profileFacebook(req.user);
      if (!create) return res.redirect(process.env.END_POINT_HOME as string);
      return res.redirect(
        `${process.env.END_POINT_HOME}?token=${create.toKen}?_id=${create._id}` as string
      );
    } catch (error) {
      return res.redirect(process.env.END_POINT_HOME as string);
    }
  }

  public async profileGoogle(req: Request, res: Response) {
    try {
      if (!req.isAuthenticated() || !req.user) {
        return res.redirect(process.env.END_POINT_HOME as string);
      }
      const create = await this.userUseCase.profileGoogle(req.user);
      if (!create) return res.redirect(process.env.END_POINT_HOME as string);
      return res.redirect(
        `${process.env.END_POINT_HOME}?token=${create.toKen}?_id=${create._id}` as string
      );
    } catch (error) {
      return res.redirect(process.env.END_POINT_HOME as string);
    }
  }

  public async orderResetPassWord(req: Request, res: Response) {
    try {
      const user = await this.checkUserByEmail(req);
      const findCode = await this.authenticatorUseCase.findByUserId(user._id as string);
      if (findCode)
        return sendRespone(
          res,
          'success',
          200,
          'we have send authenticator code to email, please checked to email or resend order code.',
          ''
        );
      const authCode = await this.authenticatorUseCase.createAuthCode(user._id as string);
      this.nodeMailerServicese.sendAuthCodeResetPassWord(user, authCode);
      return sendRespone(res, 'success', 200, 'we have send authenticator code to email.', '');
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
        return sendRespone(
          res,
          'success',
          200,
          'we have send authenticator code to email, please checked to email or try again after 1 hour.',
          ''
        );
      const authCode = await this.authenticatorUseCase.updateAuthCode(user._id as string);
      this.nodeMailerServicese.sendAuthCodeResetPassWord(user, authCode);
      return sendRespone(res, 'success', 200, 'we have send authenticator code to email.', '');
    } catch (error) {
      return RestError.manageServerError(res, error, false);
    }
  }

  public async resetPassWord(req: Request, res: Response) {
    const client = await MongoClient.connect(process.env.DATABASE, { useNewUrlParser: true });
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
      return sendRespone(res, 'success', 200, 'upadte password successfully.', '');
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      return RestError.manageServerError(res, error, false);
    }
  }

  private async checkUserByEmail(req: Request): Promise<UserSchemaProps> {
    const { email } = req.body;
    if (!email) throw new RestError('email not avalible.', 404);
    const user = await this.userUseCase.getUserByEmail(email);
    if (user && user.statusCreate === StatusCreate.IN_ACTIVE) {
      throw new RestError(
        'account have inactive, please activate code in email or resend code.',
        401
      );
    }
    return user;
  }
}
