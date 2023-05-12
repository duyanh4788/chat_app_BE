import { Request, Response } from 'express';
import { RestError } from '../services/error/error';
import { FriendsUseCase } from '../usecase/FriendsUseCase';
import { SendRespone } from '../services/success/success';

export class FriendsController {
  constructor(private friendsUseCase: FriendsUseCase) {
    this.addFriends = this.addFriends.bind(this);
    this.getListFriends = this.getListFriends.bind(this);
  }

  public async addFriends(req: Request, res: Response) {
    try {
      const { friendId } = req.body;
      const user: any = req.user;
      await this.friendsUseCase.addFriends(user._id as string, friendId);
      return new SendRespone({ message: 'add friend successfully.' }).send(res);
    } catch (error: any) {
      if (error.code === 11000) {
        return new SendRespone({ code: 404, message: 'your has add it friend.' }).send(res);
      }
      return RestError.manageServerError(res, error, false);
    }
  }

  public async getListFriends(req: Request, res: Response) {
    try {
      const user: any = req.user;
      const friends = await this.friendsUseCase.getListFriends(user._id as string);
      return new SendRespone({ data: friends, message: '' }).send(res);
    } catch (error) {
      return RestError.manageServerError(res, error, false);
    }
  }
}
