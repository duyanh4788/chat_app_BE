import AWS, { S3 } from 'aws-sdk';
import { CreateBucketRequest } from 'aws-sdk/clients/s3';
import { RestError } from '../error/error';

export class AWSServices {
    public BUCKET: string;
    public REGION: string;
    public ACCESS_KEY: string;
    public SECRET_KEY: string;

    constructor() {
        this.BUCKET = "chatapp-av";
        this.REGION = "ap-southeast-1";
        this.ACCESS_KEY = process.env.AWS_ACCESS as string;
        this.SECRET_KEY = process.env.AWS_ACCESS as string;
    }

    public configAWS(): S3 {
        const s3 = new AWS.S3({
            accessKeyId: this.ACCESS_KEY,
            secretAccessKey: this.SECRET_KEY,
            region: this.REGION
        });
        return s3
    }

    async checkBucket(s3: S3, bucket: string): Promise<boolean> {
        try {
            await s3.headBucket({ Bucket: bucket }).promise()
            return true
        } catch (error) {
            throw new RestError('Error bucket don`t exsit', 400);

        }
    }

    async createBucket(s3: S3): Promise<any> {
        const params: CreateBucketRequest = {
            Bucket: this.BUCKET,
            CreateBucketConfiguration: {
                LocationConstraint: this.REGION
            }
        }
        try {
            const result = await s3.createBucket(params).promise();
            return { success: true, message: "Bucket Created Successfull", data: result.Location }
        } catch (error) {
            throw new RestError('Unable create bucket', 400);
        }
    }
}