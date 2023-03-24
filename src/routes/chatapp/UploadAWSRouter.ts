import { Router } from 'express';
import { UploadAwsController } from '../../controllers/UploadAwsController';
import { AWS3Services } from '../../services/aws/AwsServices';
import { AuthUserMiddleware } from '../../middlewares/auth/AuthUserMiddleware';
import { VerifyTokenMiddleware } from '../../middlewares/auth/VerifyTokenMiddleware';
import { MulterMiddleware } from '../../middlewares/multer/MulterMiddleware';
import { UserDriversController } from '../../MongoDriversController/UserDriversController';
import { NodeMailerServices } from '../../services/nodemailer/MailServices';

const BASE_ROUTE = '/api/v1';

enum Routes {
  UPLOAD_AWS3 = '/upload-aws3',
  REMOVE_IMG_AWS3 = '/remove-img-aws3'
}

export class UploadAWSRouter {
  aWS3Services: AWS3Services = new AWS3Services();
  uploadAwsController: UploadAwsController = new UploadAwsController(this.aWS3Services);
  userDriversController: UserDriversController = new UserDriversController();
  private authMiddleware: AuthUserMiddleware = new AuthUserMiddleware(this.userDriversController);
  private verifyTokenMiddleware: VerifyTokenMiddleware = new VerifyTokenMiddleware();
  private multerMiddleware: MulterMiddleware = new MulterMiddleware();
  public routes(app: Router): void {
    app.post(
      BASE_ROUTE + Routes.UPLOAD_AWS3,
      this.verifyTokenMiddleware.authenTicate,
      this.authMiddleware.checkAccountExits,
      this.multerMiddleware.uploadMulter,
      this.uploadAwsController.uploadAWS
    );

    app.post(
      BASE_ROUTE + Routes.REMOVE_IMG_AWS3,
      this.verifyTokenMiddleware.authenTicate,
      this.authMiddleware.checkAccountExits,
      this.uploadAwsController.removeImageBucketAWS
    );
  }
}
