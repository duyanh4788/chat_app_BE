import { Request, Response } from 'express';
import { ConvertStationUseCase } from '../usecase/ConvertStationUseCase';
import { RestError } from '../services/error/error';
import { IUserDriversRepository } from '../Repository/IUserDriversRepository';
import { SendRespone } from '../services/success/success';

export class ConverStationController {
  constructor(
    private convertStationUseCase: ConvertStationUseCase,
    private userDriversRepository: IUserDriversRepository
  ) {
    this.saveConverStation = this.saveConverStation.bind(this);
  }

  public async saveConverStation(req: Request, res: Response) {
    const { senderId, reciverId } = req.body;
    try {
      const create = await this.convertStationUseCase.saveConverStation(senderId, reciverId);
      if (!create) throw new RestError('connect friend failed', 400);
      const reciver = await this.userDriversRepository.findById(reciverId);
      return new SendRespone({ status: 'success', code: 200, data: { ...create, avataReciver: reciver?.avatar }, message: '' }).send(res)
    } catch (error) {
      return RestError.manageServerError(res, error, false);
    }
  }
}
