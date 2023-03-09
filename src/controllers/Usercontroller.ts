import { Request, Response } from 'express';
import { RestError } from '../services/error/error';
import { sendRespone } from '../common/common.success';
import { UserUseCase } from '../usecase/UserUseCase';


export class UsersController {

  constructor(private userUseCase: UserUseCase) {

    this.getListUser = this.getListUser.bind(this)
    this.getUserById = this.getUserById.bind(this)
    this.userSignUp = this.userSignUp.bind(this)
    this.userSignIn = this.userSignIn.bind(this)
    this.changeStatusOnline = this.changeStatusOnline.bind(this)
    this.changeStatusOffline = this.changeStatusOffline.bind(this)
    this.updateInfo = this.updateInfo.bind(this)
  }

  public async getListUser(req: Request, res: Response) {
    try {
      const listUsers = await this.userUseCase.getListUser();
      if (listUsers && !listUsers.length) {
        throw new RestError('DATA NOT FOUND!', 400)
      }
      return sendRespone(res, 'success', 200, listUsers, '')
    } catch (error) {
      return RestError.manageServerError(res, error, false)
    }
  }

  public async getUserById(req: Request, res: Response) {
    try {
      const user = await this.userUseCase.getUserById(req.params.id);
      if (!user) {
        throw new RestError('USER NOT FOUND!', 400)
      }
      return sendRespone(res, 'success', 200, user, '')
    } catch (error) {
      return RestError.manageServerError(res, error, false)
    }
  }

  public async userSignUp(req: Request, res: Response) {
    try {
      const { account, passWord, fullName, email } = req.body;
      const create = await this.userUseCase.userSignUp(account, passWord, fullName, email);
      if (!create) throw new RestError('Sign Up failed', 400);
      return sendRespone(res, 'success', 200, null, 'Sign Up successfully.')
    } catch (error) {
      return RestError.manageServerError(res, error, false)
    }
  }

  public async userSignIn(req: Request, res: Response) {
    try {
      const { account, passWord } = req.body;
      const userSignIn = await this.userUseCase.userSignIn(account, passWord)
      if (!userSignIn) throw new RestError('login failed', 400);
      return sendRespone(res, 'success', 200, userSignIn, 'login successfuly')
    } catch (error) {
      return RestError.manageServerError(res, error, false)
    }
  }

  public async changeStatusOnline(req: Request, res: Response) {
    try {
      const update = await this.userUseCase.changeStatus(req.body.id, true);
      if (!update) throw new RestError('Update status failed', 400);
      return sendRespone(res, 'success', 200, null, 'update status successfuly')
    } catch (error) {
      return RestError.manageServerError(res, error, false)
    }
  }

  public async changeStatusOffline(req: Request, res: Response) {
    try {
      const update = await this.userUseCase.changeStatus(req.body.id, false);
      if (!update) throw new RestError('Update status failed', 400);
      return sendRespone(res, 'success', 200, null, 'update status successfuly')
    } catch (error) {
      return RestError.manageServerError(res, error, false)
    }
  }

  public async updateInfo(req: Request, res: Response) {
    try {
      const update = await this.userUseCase.updateInfo(req.body);
      if (!update) throw new RestError('Update status failed', 400);
      return sendRespone(res, 'success', 200, null, 'update successfuly')
    } catch (error) {
      return RestError.manageServerError(res, error, false)
    }
  }
}
