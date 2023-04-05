import { Request, Response } from 'express';
import { AWS3Services } from '../services/aws/AwsServices';
import { RestError } from '../services/error/error';
import { SendRespone } from '../services/success/success';
import { isDevelopment } from '../server';
export class UploadAwsController {
  constructor(private aws3: AWS3Services) {
    this.uploadAWS = this.uploadAWS.bind(this);
    this.removeImageBucketAWS = this.removeImageBucketAWS.bind(this);
  }

  public async uploadAWS(req: Request, res: Response) {
    try {
      if (!isDevelopment) {
        if (!req.file.path) {
          return new SendRespone({ status: 'error', code: 404, message: 'upload failed.' }).send(res);
        }
        const url = process.env.END_POINT_SERVER?.split('/api/v1')[0] + ':50004/public/images/' + req.file.path;
        return new SendRespone({ data: url, message: 'upload successfullly.' }).send(res);
      }
      const s3 = this.aws3.configAWS();
      const upload = await this.aws3.uploadToAWSS3(s3, req.file as Express.Multer.File);
      return new SendRespone({ data: upload.data, message: 'upload successfullly.' }).send(res);
    } catch (error) {
      return RestError.manageServerError(res, error, false);
    }
  }

  public async removeImageBucketAWS(req: Request, res: Response) {
    try {
      const { idImage } = req.body;
      const s3 = this.aws3.configAWS();
      await this.aws3.removeImageBucketAWS(s3, idImage);
      return new SendRespone({ message: 'remove successfullly.' }).send(res);
    } catch (error) {
      return RestError.manageServerError(res, error, false);
    }
  }
}
