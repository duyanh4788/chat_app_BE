import { Request, Response, NextFunction } from 'express';
import { SendRespone } from '../../services/success/success';
import { IUserDriversRepository } from '../../Repository/IUserDriversRepository';
import { IFriendsDriversRepository } from '../../Repository/IFriendsDriversRepository';
import { IConvertStationDriversRepository } from '../../Repository/IConvertStationDriversRepository';

export class MessagesMiddleware {
  constructor(
    private userDriversRepository: IUserDriversRepository,
    private convertStationDriversRepository: IConvertStationDriversRepository,
    private friendsDriversRepository: IFriendsDriversRepository
  ) {
    this.checkUserId = this.checkUserId.bind(this);
    this.checkConvertStationId = this.checkConvertStationId.bind(this);
  }
  public async checkUserId(req: Request, res: Response, next: NextFunction) {
    const senderInfor = await this.userDriversRepository.findById(req.body.senderId);
    if (!senderInfor) {
      return new SendRespone({ message: 'sender id not found!' }).send(res);
    }
    const friend = await this.friendsDriversRepository.findUserIdFriendId(req.body.senderId, req.body.reciverId);
    if (!friend || !friend.isFriend) {
      return new SendRespone({ message: 'your guy are not friend.' }).send(res);
    }
    next();
  }

  public async checkConvertStationId(req: Request, res: Response, next: NextFunction) {
    const convertStation = await this.convertStationDriversRepository.findConverStationById(req.body.conversationId);
    if (!convertStation) {
      return new SendRespone({ message: 'convert station id not found!' }).send(res);
    }
    if (convertStation) {
      next();
    }
  }
}
