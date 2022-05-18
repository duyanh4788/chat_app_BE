import { Router } from 'express';
import { UsersControler } from '../../controllers/user.controller';
import { AuthUserMiddleware } from '../../middlewares/auth/authUser.middleware';
import { VerifyTokenMiddleware } from '../../middlewares/auth/verifyToken.middleware';

export class UsersRoutes {
  public usersController: UsersControler = new UsersControler();
  public authMiddleware: AuthUserMiddleware = new AuthUserMiddleware();
  public verifyTokenMiddleware: VerifyTokenMiddleware =
    new VerifyTokenMiddleware();
  public routes(app: Router): void {
    app
      .route('/listUser')
      .get(
        this.verifyTokenMiddleware.authenTicate,
        this.usersController.getListUser,
      );
    app
      .route('/getUserById/:id')
      .get(
        this.verifyTokenMiddleware.authenTicate,
        this.usersController.getUserById,
      );
    app.route('/signIn').post(this.usersController.userSignIn);
    app
      .route('/signUp')
      .post(
        this.authMiddleware.checkAccount,
        this.authMiddleware.checkEmailExits,
        this.authMiddleware.checkEmpty,
        this.authMiddleware.checkEmailPattern,
        this.authMiddleware.checkReqLength,
        this.usersController.userSignUp,
      );
  }
}
