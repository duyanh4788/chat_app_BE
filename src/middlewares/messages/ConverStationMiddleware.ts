import { Request, Response, NextFunction } from 'express';
import { IConvertStationDriversRepository } from '../../Repository/IConvertStationDriversRepository';
import { IUserDriversRepository } from '../../Repository/IUserDriversRepository';
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
      return res
        .status(404)
        .json({ status: 'error', code: 404, data: null, message: 'id Sender or Reciver is null!' });
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
      return res.status(200).send({
        data: { ...converStationByUserId, avataReciver: reciver?.avatar },
        code: 200,
        success: true
      });
    }
    if (!converStationByUserId) {
      next();
    }
  }
}
