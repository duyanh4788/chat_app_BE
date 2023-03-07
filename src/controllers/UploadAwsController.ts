import { Request, Response } from 'express';
import { sendRespone } from '../common/common.success';
import { AWS3Services } from '../services/aws/AwsServices';
import { RestError } from '../services/error/error';

export class UploadAwsController {
    constructor(private aws3: AWS3Services) {
        this.uploadAWS = this.uploadAWS.bind(this)
    }

    public async uploadAWS(req: Request, res: Response) {
        try {
            const s3 = this.aws3.configAWS();
            const upload = await this.aws3.uploadToAWSS3(s3, req.file as Express.Multer.File)
            return sendRespone(res, 'success', 200, upload.data, 'upload successfullly.')
        } catch (error) {
            return RestError.manageServerError(res, error, false)
        }
    }
}

function sharpe(buffer: Buffer) {
    throw new Error('Function not implemented.');
}
