import { Router } from 'express';
import { UsersController } from '../../controllers/Usercontroller';
import { AuthUserMiddleware } from '../../middlewares/auth/AuthUserMiddleware';
import { VerifyTokenMiddleware } from '../../middlewares/auth/VerifyTokenMiddleware';
import { UserDriversController } from '../../MongoDriversController/UserDriversController';
import { FaceBookService } from '../../services/facebook/FaceBookServices';
import { UserUseCase } from '../../usecase/UserUseCase';
import passport from 'passport';

const BASE_ROUTE = '/api/v1';

enum Routes {
  LIST_USERS = '/listUser',
  GET_USER_BY_ID = '/getUserById/:id',
  SIGN_IN = '/signIn',
  SIGN_UP = '/signUp',
  CHANGE_STATUS_ONLINE = '/changeStatusOnline',
  CHANGE_STATUS_OFFLINE = '/changeStatusOffline',
  UPDATE_INFOR = '/update-infor',
  LOGIN_FB = '/login-fb',
  CALL_BACK_FB = '/callback-fb',
  PROFILE_FB = '/profile-fb',
  LOGIN_GG = '/login-gg',
}


export class UsersRoutes {
  private readonly DOMAIN = process.env.END_POINT_SERVER
  private userDriversController: UserDriversController = new UserDriversController();
  private faceBookService: FaceBookService = new FaceBookService(this.userDriversController)
  private userUseCase: UserUseCase = new UserUseCase(this.userDriversController, this.faceBookService);
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
    app.post(BASE_ROUTE + Routes.SIGN_UP, this.authMiddleware.validateSignUp, this.usersController.userSignUp);
    app.post(BASE_ROUTE + Routes.LOGIN_FB, this.usersController.userSignUpWithFB);
    app.post(BASE_ROUTE + Routes.CHANGE_STATUS_ONLINE, this.usersController.changeStatusOnline);
    app.post(BASE_ROUTE + Routes.CHANGE_STATUS_ONLINE, this.usersController.changeStatusOffline);
    app.put(BASE_ROUTE + Routes.UPDATE_INFOR, this.usersController.updateInfo);



    // ** services //
    app.get(BASE_ROUTE + Routes.LOGIN_FB, passport.authenticate('facebook'));
    app.get(BASE_ROUTE + Routes.CALL_BACK_FB, passport.authenticate('facebook', { successRedirect: this.DOMAIN + Routes.PROFILE_FB, failureRedirect: 'http://localhost:3008/' }));
    app.get(BASE_ROUTE + Routes.PROFILE_FB, passport.session(), this.usersController.profileFacebook);
  }
}
