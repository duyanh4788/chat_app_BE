import { ConverStationController } from '../../controllers/ConvertStationController';
import { Router } from 'express';
import { ConverStationMiddleware } from '../../middlewares/messages/ConverStationMiddleware';
import { ConvertStationDriversController } from '../../MongoDriversController/ConvertStationDriversController';
import { ConvertStationUseCase } from '../../usecase/ConvertStationUseCase';
import { UserDriversController } from '../../MongoDriversController/UserDriversController';

const BASE_ROUTE = '/api/v1';

enum Routes {
  SAVE_CONVERSTATION = '/saveConvertStation',
}

export class ConverStationRoutes {

  convertStationDriversController: ConvertStationDriversController = new ConvertStationDriversController();
  userDriversController: UserDriversController = new UserDriversController();
  convertStationUseCase: ConvertStationUseCase = new ConvertStationUseCase(this.convertStationDriversController)
  converStationController: ConverStationController = new ConverStationController(this.convertStationUseCase, this.userDriversController);
  converStationMiddleware: ConverStationMiddleware = new ConverStationMiddleware(this.convertStationDriversController, this.userDriversController);

  public routes(app: Router): void {
    app.post(
      BASE_ROUTE + Routes.SAVE_CONVERSTATION,
      this.converStationMiddleware.checkEmptyId,
      this.converStationMiddleware.getConverStationByUserId,
      this.converStationController.saveConverStation,
    );
  }

}