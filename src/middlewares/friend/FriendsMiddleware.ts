import { Request, Response, NextFunction } from 'express';
import { IFriendsDriversRepository } from '../../Repository/IFriendsDriversRepository';
import { IUserDriversRepository } from '../../Repository/IUserDriversRepository';
import { SendRespone } from '../../services/success/success';
import { TypeOfValue, isCheckedTypeValues } from '../../utils/validate';

export class FriendsMiddleware {
  constructor(private friendsDriversRepository: IFriendsDriversRepository, private userDriversRepository: IUserDriversRepository) {}

  public checkFriendId(req: Request, res: Response, next: NextFunction) {
    const { friendId } = req.body;
    if (!isCheckedTypeValues(friendId, TypeOfValue.STRING)) {
      return new SendRespone({
        status: 'error',
        code: 404,
        message: 'id not available.'
      }).send(res);
    }
    next();
  }

  public checkId(req: Request, res: Response, next: NextFunction) {
    const { id } = req.body;
    if (!isCheckedTypeValues(id, TypeOfValue.STRING)) {
      return new SendRespone({
        status: 'error',
        code: 404,
        message: 'id not available.'
      }).send(res);
    }
    next();
  }

  public async getFriendById(req: Request, res: Response, next: NextFunction) {}
}
