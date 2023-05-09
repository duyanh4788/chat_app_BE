import { Router } from 'express';
import { UploadAwsController } from '../../controllers/UploadAwsController';
import { AWS3Services } from '../../services/aws/AwsServices';
import { VerifyTokenMiddleware } from '../../middlewares/auth/VerifyTokenMiddleware';
import { MulterMiddleware } from '../../middlewares/multer/MulterMiddleware';
import { UploadFilesUseCase } from '../../usecase/UploadFilesUseCase';

const BASE_ROUTE = '/images';

enum Routes {
  UPLOAD_AWS3 = '/upload-aws3',
  REMOVE_IMG_AWS3 = '/remove-img-aws3'
}

export class UploadAWSRouter {
  aWS3Services: AWS3Services = new AWS3Services();
  uploadFilesUseCase: UploadFilesUseCase = new UploadFilesUseCase();
  uploadAwsController: UploadAwsController = new UploadAwsController(this.aWS3Services, this.uploadFilesUseCase);
  private verifyTokenMiddleware: VerifyTokenMiddleware = new VerifyTokenMiddleware();
  private multerMiddleware: MulterMiddleware = new MulterMiddleware();
  public routes(app: Router): void {
    app.post(
      BASE_ROUTE + Routes.UPLOAD_AWS3,
      this.verifyTokenMiddleware.authenTicate,
      this.multerMiddleware.uploadMulter,
      this.uploadAwsController.uploadAWS
    );
    app.post(BASE_ROUTE + Routes.REMOVE_IMG_AWS3, this.verifyTokenMiddleware.authenTicate, this.uploadAwsController.removeImageBucketAWS);
  }
}
