import { Request, Response, NextFunction } from 'express';
import { IConvertStationDriversRepository } from '../../Repository/IConvertStationDriversRepository';
import { IUserDriversRepository } from '../../Repository/IUserDriversRepository';
import { SendRespone } from '../../services/success/success';
import { IFriendsDriversRepository } from '../../Repository/IFriendsDriversRepository';
import { TypeOfValue, isCheckedTypeValues } from '../../utils/validate';
export class ConverStationMiddleware {
  constructor(
    private convertStationDriversRepository: IConvertStationDriversRepository,
    private userDriversRepository: IUserDriversRepository,
    private friendsDriversRepository: IFriendsDriversRepository
  ) {
    this.getConverStationByUserId = this.getConverStationByUserId.bind(this);
  }

  public checkEmptyId(req: Request, res: Response, next: NextFunction) {
    const { senderId, reciverId } = req.body;
    if (!isCheckedTypeValues(senderId, TypeOfValue.STRING) && !isCheckedTypeValues(reciverId, TypeOfValue.STRING)) {
      return new SendRespone({
        status: 'error',
        code: 404,
        message: 'id Sender or Reciver is null!'
      }).send(res);
    }
    return next();
  }

  public async getConverStationByUserId(req: Request, res: Response, next: NextFunction) {
    const { senderId, reciverId } = req.body;
    const friend = await this.friendsDriversRepository.findUserIdFriendId(senderId, reciverId);
    if (!friend || !friend.isFriend) {
      return new SendRespone({ code: 400, message: 'your guy are not friend.' }).send(res);
    }
    const converStationByUserId = await this.convertStationDriversRepository.findConverStation(senderId, reciverId);
    if (converStationByUserId) {
      const reciver = await this.userDriversRepository.findById(reciverId);
      return new SendRespone({
        data: { ...converStationByUserId, avataReciver: reciver?.avatar }
      }).send(res);
    }
    if (!converStationByUserId) {
      next();
    }
  }
}
