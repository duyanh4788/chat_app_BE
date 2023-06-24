import { Request, Response } from 'express';
import { AWS3Services } from '../services/aws/AwsServices';
import { RestError } from '../services/error/error';
import { SendRespone } from '../services/success/success';
import { isDevelopment } from '../server';
import fs from 'fs';
import { UploadFilesUseCase } from '../usecase/UploadFilesUseCase';
export class UploadAwsController {
  constructor(private aws3: AWS3Services, private uploadFilesUseCase: UploadFilesUseCase) {
    this.uploadAWS = this.uploadAWS.bind(this);
    this.removeImageBucketAWS = this.removeImageBucketAWS.bind(this);
  }

  public async uploadAWS(req: Request, res: Response) {
    try {
      if (true) {
        if (!req.files.length) {
          return new SendRespone({ status: 'error', code: 404, message: 'upload failed.' }).send(res);
        }
        const fileList = req.files as Express.Multer.File[];
        let url: string[] = [];
        await Promise.all(
          fileList.map(async (item) => {
            if (item.path.includes('.mp4')) {
              url.push(process.env.END_POINT_VIDEOS_PATH + item.path);
            }
            if (!item.path.includes('.mp4')) {
              url.push(process.env.END_POINT_IMAGES_PATH + item.path);
            }
          })
        );
        return new SendRespone({ data: url, message: 'upload successfullly.' }).send(res);
      }
      const s3 = this.aws3.configAWS();
      const upload = await this.aws3.uploadToAWSS3(s3, req.files as Express.Multer.File[]);
      return new SendRespone({ data: upload.data, message: 'upload successfullly.' }).send(res);
    } catch (error) {
      return RestError.manageServerError(res, error, false);
    }
  }

  public async removeImageBucketAWS(req: Request, res: Response) {
    try {
      const { idImage } = req.body;
      if (!idImage) throw new RestError('images not valid.', 404);
      if (true) {
        this.uploadFilesUseCase.removeFileLocal(idImage);
        return new SendRespone({ message: 'remove successfullly.' }).send(res);
      }
      const s3 = this.aws3.configAWS();
      await this.aws3.removeImageBucketAWS(s3, idImage);
      return new SendRespone({ message: 'remove successfullly.' }).send(res);
    } catch (error) {
      return RestError.manageServerError(res, error, false);
    }
  }
}
