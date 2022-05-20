import { Router } from 'express';
import { UsersControler } from '../../controllers/user.controller';
import { AuthUserMiddleware } from '../../middlewares/auth/authUser.middleware';
import { VerifyTokenMiddleware } from '../../middlewares/auth/verifyToken.middleware';

export class UsersRoutes {
  usersController: UsersControler = new UsersControler();
  authMiddleware: AuthUserMiddleware = new AuthUserMiddleware();
  verifyTokenMiddleware: VerifyTokenMiddleware = new VerifyTokenMiddleware();
  public routes(app: Router): void {
    app
      .route('/api/v1/listUser')
      .get(
        this.verifyTokenMiddleware.authenTicate,
        this.usersController.getListUser,
      );
    app
      .route('/api/v1/getUserById/:id')
      .get(
        this.verifyTokenMiddleware.authenTicate,
        this.usersController.getUserById,
      );
    app.route('/api/v1/signIn').post(this.usersController.userSignIn);
    app
      .route('/api/v1/signUp')
      .post(
        this.authMiddleware.checkAccount,
        this.authMiddleware.checkEmailExits,
        this.authMiddleware.checkEmpty,
        this.authMiddleware.checkEmailPattern,
        this.authMiddleware.checkReqLength,
        this.usersController.userSignUp,
      );
    app
      .route('/api/v1/changeStatusOnline')
      .post(this.usersController.changeStatusOnline);
    app
      .route('/api/v1/changeStatusOffline')
      .post(this.usersController.changeStatusOffline);
  }
}
