import { ConverStationController } from '../../controllers/convertStation.controller';
import { Router } from 'express';
import { ConverStationMiddleware } from '../../middlewares/messages/converStation.middleware';

export class ConverStationRoutes {
  converStationController: ConverStationController =
    new ConverStationController();
  converStationMiddleware: ConverStationMiddleware =
    new ConverStationMiddleware();
  public routes(app: Router): void {
    app
      .route('/api/v1/saveConvertStation')
      .get(
        this.converStationMiddleware.checkEmptyId,
        this.converStationMiddleware.getConverStationByUserId,
        this.converStationController.saveConverStation,
      );
  }
}