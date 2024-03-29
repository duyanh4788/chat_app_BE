import { Router } from 'express';
import { UsersController } from '../../controllers/Usercontroller';
import { AuthUserMiddleware } from '../../middlewares/auth/AuthUserMiddleware';
import { VerifyTokenMiddleware } from '../../middlewares/auth/VerifyTokenMiddleware';
import { UserDriversController } from '../../MongoDriversController/UserDriversController';
import { FaceBookService } from '../../services/facebook/FaceBookServices';
import { UserUseCase } from '../../usecase/UserUseCase';
import passport from 'passport';
import { GoogleServices } from '../../services/google/GoogleServices';
import { AuthenticatorUseCase } from '../../usecase/AuthenticatorUseCase';
import { AuthenticatorStationDriversController } from '../../MongoDriversController/AuthenticatorStationDriversController';
import { AuthenticatorAppStationDriversController } from '../../MongoDriversController/AuthenticatorAppStationDriversController';

const BASE_ROUTE = '/users';

enum Routes {
  LIST_USERS = '/listUser',
  GET_USER_BY_ID = '/getUserById/:id',
  SIGN_IN = '/signIn',
  SIGN_IN_WITH_CODE = '/signin-withcode',
  SIGN_IN_WITH_APP = '/signin-withapp',
  SIGN_UP = '/signUp',
  ACTIVE_USER = '/active/:authCode',
  CHANGE_STATUS_ONLINE = '/changeStatusOnline',
  CHANGE_STATUS_OFFLINE = '/changeStatusOffline',
  UPDATE_INFOR = '/update-infor',
  LOGIN_FB = '/login-fb',
  CALL_BACK_FB = '/callback-fb',
  PROFILE_FB = '/profile-fb',
  LOGIN_GG = '/login-gg',
  CALL_BACK_GG = '/callback-gg',
  PROFILE_GG = '/profile-gg',
  ORDER_RESET_PASSWORD = '/order-reset-password',
  RESEND_ORDER_RESET_PASSWORD = '/resend-order-reset-password',
  RESET_PASSWORD = '/reset-password',
  GET_AUTH_PAIR = '/get-auth-pair',
  PAIR_AUTH = '/pair-auth'
}

export class UsersRoutes {
  private userDriversController: UserDriversController = new UserDriversController();
  private authenticatorStationDriversController: AuthenticatorStationDriversController = new AuthenticatorStationDriversController();
  private authenticatorAppStationDriversController: AuthenticatorAppStationDriversController = new AuthenticatorAppStationDriversController();
  private faceBookService: FaceBookService = new FaceBookService(this.userDriversController);
  private googleServices: GoogleServices = new GoogleServices(this.userDriversController);
  private userUseCase: UserUseCase = new UserUseCase(this.userDriversController);
  private AuthenticatorUseCase: AuthenticatorUseCase = new AuthenticatorUseCase(
    this.authenticatorStationDriversController,
    this.authenticatorAppStationDriversController
  );
  private usersController: UsersController = new UsersController(this.userUseCase, this.AuthenticatorUseCase);
  private authMiddleware: AuthUserMiddleware = new AuthUserMiddleware(this.userDriversController);
  private verifyTokenMiddleware: VerifyTokenMiddleware = new VerifyTokenMiddleware();

  public routes(app: Router): void {
    app.post(BASE_ROUTE + Routes.SIGN_IN, this.usersController.userSignIn);
    app.post(BASE_ROUTE + Routes.SIGN_IN_WITH_CODE, this.usersController.userSignInWithCode);
    app.post(BASE_ROUTE + Routes.SIGN_IN_WITH_APP, this.usersController.userSignInWithApp);
    app.post(BASE_ROUTE + Routes.SIGN_UP, this.authMiddleware.validateSignUp, this.usersController.userSignUp);
    app.get(BASE_ROUTE + Routes.ACTIVE_USER, this.usersController.activeUser);
    app.post(BASE_ROUTE + Routes.ORDER_RESET_PASSWORD, this.usersController.orderResetPassWord);
    app.post(BASE_ROUTE + Routes.RESEND_ORDER_RESET_PASSWORD, this.usersController.resendOrderResetPassWord);
    app.post(BASE_ROUTE + Routes.RESET_PASSWORD, this.usersController.resetPassWord);
    // ** services FB//
    app.post(BASE_ROUTE + Routes.LOGIN_FB, this.usersController.userSignUpWithFB);
    app.get(BASE_ROUTE + Routes.LOGIN_FB, this.faceBookService.authenticate());
    app.get(BASE_ROUTE + Routes.CALL_BACK_FB, this.faceBookService.handleCallback());
    app.get(BASE_ROUTE + Routes.PROFILE_FB, passport.session(), this.usersController.profileFacebook);
    // ** services GG//
    app.post(BASE_ROUTE + Routes.LOGIN_GG, this.usersController.userSignUpWithGG);
    app.get(BASE_ROUTE + Routes.LOGIN_GG, this.googleServices.authenticate());
    app.get(BASE_ROUTE + Routes.CALL_BACK_GG, this.googleServices.handleCallback());
    app.get(BASE_ROUTE + Routes.PROFILE_GG, passport.session(), this.usersController.profileGoogle);

    // ** services Authentica//
    app.get(BASE_ROUTE + Routes.LIST_USERS, this.verifyTokenMiddleware.authenTicate, this.usersController.getListUser);
    app.get(BASE_ROUTE + Routes.GET_USER_BY_ID, this.verifyTokenMiddleware.authenTicate, this.usersController.getUserById);
    app.post(BASE_ROUTE + Routes.CHANGE_STATUS_ONLINE, this.verifyTokenMiddleware.authenTicate, this.usersController.changeStatusOnline);
    app.post(BASE_ROUTE + Routes.CHANGE_STATUS_ONLINE, this.verifyTokenMiddleware.authenTicate, this.usersController.changeStatusOffline);
    app.put(BASE_ROUTE + Routes.UPDATE_INFOR, this.verifyTokenMiddleware.authenTicate, this.authMiddleware.checkTypeAccountChatAppById, this.usersController.updateInfo);
    app.get(BASE_ROUTE + Routes.GET_AUTH_PAIR, this.verifyTokenMiddleware.authenTicate, this.authMiddleware.checkTypeAccountChatAppById, this.usersController.getAuthPair);
    app.post(BASE_ROUTE + Routes.PAIR_AUTH, this.verifyTokenMiddleware.authenTicate, this.authMiddleware.checkTypeAccountChatAppById, this.usersController.pairAuth);
  }
}
