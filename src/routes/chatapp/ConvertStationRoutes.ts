import { ConverStationController } from '../../controllers/ConvertStationController';
import { Router } from 'express';
import { ConverStationMiddleware } from '../../middlewares/messages/ConverStationMiddleware';
import { ConvertStationDriversController } from '../../MongoDriversController/ConvertStationDriversController';
import { ConvertStationUseCase } from '../../usecase/ConvertStationUseCase';
import { UserDriversController } from '../../MongoDriversController/UserDriversController';
import { VerifyTokenMiddleware } from '../../middlewares/auth/VerifyTokenMiddleware';
import { FriendsDriversController } from '../../MongoDriversController/FriendsDriversController';

const BASE_ROUTE = '/convertStations';

enum Routes {
  SAVE_CONVERSTATION = '/saveConvertStation'
}

export class ConverStationRoutes {
  private verifyTokenMiddleware: VerifyTokenMiddleware = new VerifyTokenMiddleware();
  convertStationDriversController: ConvertStationDriversController = new ConvertStationDriversController();
  userDriversController: UserDriversController = new UserDriversController();
  private friendsDriversController: FriendsDriversController = new FriendsDriversController();
  convertStationUseCase: ConvertStationUseCase = new ConvertStationUseCase(this.convertStationDriversController);
  converStationController: ConverStationController = new ConverStationController(this.convertStationUseCase, this.userDriversController);
  converStationMiddleware: ConverStationMiddleware = new ConverStationMiddleware(
    this.convertStationDriversController,
    this.userDriversController,
    this.friendsDriversController
  );

  public routes(app: Router): void {
    app.post(
      BASE_ROUTE + Routes.SAVE_CONVERSTATION,
      this.verifyTokenMiddleware.authenTicate,
      this.converStationMiddleware.checkEmptyId,
      this.converStationMiddleware.getConverStationByUserId,
      this.converStationController.saveConverStation
    );
  }
}
