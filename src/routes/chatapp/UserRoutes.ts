import { Router } from 'express';
import { UsersController } from '../../controllers/Usercontroller';
import { AuthUserMiddleware } from '../../middlewares/auth/AuthUserMiddleware';
import { VerifyTokenMiddleware } from '../../middlewares/auth/VerifyTokenMiddleware';
import { UserDriversController } from '../../MongoDriversController/UserDriversController';
import { UserUseCase } from '../../usecase/UserUseCase';

const BASE_ROUTE = '/api/v1';

enum Routes {
  LIST_USERS = '/listUser',
  GET_USER_BY_ID = '/getUserById/:id',
  SIGN_IN = '/signIn',
  SIGN_UP = '/signUp',
  CHANGE_STATUS_ONLINE = '/changeStatusOnline',
  CHANGE_STATUS_OFFLINE = '/changeStatusOffline',
}


export class UsersRoutes {
  private userDriversController: UserDriversController = new UserDriversController();
  private userUseCase: UserUseCase = new UserUseCase(this.userDriversController);
  private usersController: UsersController = new UsersController(this.userUseCase);
  private authMiddleware: AuthUserMiddleware = new AuthUserMiddleware();
  private verifyTokenMiddleware: VerifyTokenMiddleware = new VerifyTokenMiddleware();

  public routes(app: Router): void {
    app.get(
      BASE_ROUTE + Routes.LIST_USERS,
      this.verifyTokenMiddleware.authenTicate,
      this.usersController.getListUser,
    );

    app.get(
      BASE_ROUTE + Routes.GET_USER_BY_ID,
      this.verifyTokenMiddleware.authenTicate,
      this.usersController.getUserById,
    );

    app.post(BASE_ROUTE + Routes.SIGN_IN, this.usersController.userSignIn);

    app.post(
      BASE_ROUTE + Routes.SIGN_UP,
      this.authMiddleware.validateSignUp,
      this.usersController.userSignUp,
    );

    app.post(BASE_ROUTE + Routes.CHANGE_STATUS_ONLINE, this.usersController.changeStatusOnline);

    app.post(BASE_ROUTE + Routes.CHANGE_STATUS_ONLINE, this.usersController.changeStatusOffline);
  }
}
