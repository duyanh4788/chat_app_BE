import AWS, { S3 } from 'aws-sdk';
import { CreateBucketRequest } from 'aws-sdk/clients/s3';
import { RestError } from '../error/error';

export class AWS3Services {
    private readonly BUCKET: string;
    private readonly ACCESS_KEY: string;
    private readonly SECRET_KEY: string;
    private readonly REGION: string;
    private readonly DOMAIN: string;

    constructor() {
        this.BUCKET = process.env.AWS_BUCKET_NAME as string;
        this.ACCESS_KEY = process.env.AWS_ACCESS as string;
        this.SECRET_KEY = process.env.AWS_SECRET as string;
        this.REGION = process.env.AWS_REGION as string;
        this.DOMAIN = process.env.AWS_DOMAIN as string;
    }

    public configAWS(): S3 {
        const s3 = new AWS.S3({
            accessKeyId: this.ACCESS_KEY,
            secretAccessKey: this.SECRET_KEY,
        });
        return s3
    }

    async createBucket(s3: S3): Promise<void> {
        const params: CreateBucketRequest = {
            Bucket: this.BUCKET,
            CreateBucketConfiguration: {
                LocationConstraint: this.REGION,
            }
        }
        try {
            const checkBucket = await s3.headBucket({ Bucket: this.BUCKET }).promise()
            if (checkBucket) {
                await s3.createBucket(params).promise();
                return
            }
        } catch (error) {
            throw new RestError('Unable create bucket', 400);
        }
    }

    async uploadToAWSS3(s3: S3, fileData: Express.Multer.File): Promise<any> {

        const params = {
            Bucket: this.BUCKET,
            Key: `img/${Date.now()}.${fileData.originalname.split('.')[1]}`,
            Body: fileData.buffer,
            ContentType: fileData.mimetype
        }; fileData.originalname

        try {
            const result = await s3.upload(params).promise();
            return { success: true, data: this.DOMAIN + result.Key }
        } catch (error) {
            throw new RestError('upload failed', 400);
        }
    }
}