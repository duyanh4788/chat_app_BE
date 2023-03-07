import { Request, Response } from 'express';
import { ConvertStationUseCase } from '../usecase/ConvertStationUseCase';
import { RestError } from '../services/error/error';
import { sendRespone } from '../common/common.success';

export class ConverStationController {

  constructor(private convertStationUseCase: ConvertStationUseCase) {
    this.saveConverStation = this.saveConverStation.bind(this)
  }

  public async saveConverStation(req: Request, res: Response) {
    const { senderId, reciverId } = req.body;
    try {
      const create = await this.convertStationUseCase.saveConverStation(senderId, reciverId);
      if (!create) throw new RestError('connect friend failed', 400);
      return sendRespone(res, 'success', 200, create, '')
    } catch (error) {
      return RestError.manageServerError(res, error, false)
    }
  }
}
