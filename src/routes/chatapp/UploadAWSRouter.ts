import { Router } from 'express';
import { UploadAwsController } from '../../controllers/UploadAwsController';
import { AWS3Services } from '../../services/aws/AwsServices';
import { AuthUserMiddleware } from '../../middlewares/auth/AuthUserMiddleware';
import { VerifyTokenMiddleware } from '../../middlewares/auth/VerifyTokenMiddleware';
import { MulterMiddleware } from '../../middlewares/multer/MulterMiddleware';

const BASE_ROUTE = '/api/v1';

enum Routes {
  UPLOAD_AWS3 = '/upload-aws3',
}

export class UploadAWSRouter {

  aWS3Services: AWS3Services = new AWS3Services()
  uploadAwsController: UploadAwsController = new UploadAwsController(this.aWS3Services)
  private authMiddleware: AuthUserMiddleware = new AuthUserMiddleware();
  private verifyTokenMiddleware: VerifyTokenMiddleware = new VerifyTokenMiddleware();
  private multerMiddleware: MulterMiddleware = new MulterMiddleware()
  public routes(app: Router): void {
    app.post(
      BASE_ROUTE + Routes.UPLOAD_AWS3,
      this.authMiddleware.checkAccount,
      this.verifyTokenMiddleware.authenTicate,
      this.multerMiddleware.upload,
      this.uploadAwsController.uploadAWS,
    );
  }

}