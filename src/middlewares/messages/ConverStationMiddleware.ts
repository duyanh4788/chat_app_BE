import { Request, Response, NextFunction } from 'express';
import { IConvertStationDriversRepository } from '../../Repository/IConvertStationDriversRepository';
import { IUserDriversRepository } from '../../Repository/IUserDriversRepository';
import { SendRespone } from '../../services/success/success';
export class ConverStationMiddleware {
  constructor(
    private convertStationDriversRepository: IConvertStationDriversRepository,
    private userDriversRepository: IUserDriversRepository
  ) {
    this.getConverStationByUserId = this.getConverStationByUserId.bind(this);
  }

  public checkEmptyId(req: Request, res: Response, next: NextFunction) {
    const { senderId, reciverId } = req.body;
    if (senderId && senderId !== '' && reciverId && reciverId !== '') {
      return next();
    } else {
      return new SendRespone({ status: 'error', code: 404, message: 'id Sender or Reciver is null!' }).send(res);
    }
  }
  public async getConverStationByUserId(req: Request, res: Response, next: NextFunction) {
    const { senderId, reciverId } = req.body;
    const converStationByUserId = await this.convertStationDriversRepository.findConverStation(
      senderId,
      reciverId
    );
    if (converStationByUserId) {
      const reciver = await this.userDriversRepository.findById(reciverId);
      return new SendRespone({ data: { ...converStationByUserId, avataReciver: reciver?.avatar } }).send(res);
    }
    if (!converStationByUserId) {
      next();
    }
  }
}
