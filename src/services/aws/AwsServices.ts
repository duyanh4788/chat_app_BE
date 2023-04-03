import { Upload } from '@aws-sdk/lib-storage';
import { CreateBucketCommandInput, S3 } from '@aws-sdk/client-s3';
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
    const s3 = new S3({
      region: this.REGION,
      credentials: {
        accessKeyId: this.ACCESS_KEY,
        secretAccessKey: this.SECRET_KEY
      }
    });
    return s3;
  }

  async createBucket(s3: S3): Promise<void> {
    const params: CreateBucketCommandInput = {
      Bucket: this.BUCKET,
      CreateBucketConfiguration: {
        LocationConstraint: this.REGION
      }
    };
    try {
      const checkBucket = await s3.headBucket({ Bucket: this.BUCKET });
      if (checkBucket) {
        await s3.createBucket(params);
        return;
      }
    } catch (error) {
      throw new RestError('Unable create bucket', 400);
    }
  }

  async removeImageBucketAWS(s3: S3, idImage: string): Promise<void> {
    try {
      const splitUrl = idImage.split(`${this.DOMAIN}`);
      if (!splitUrl[1]) {
        throw new RestError('id not found, please try again!');
      }
      await s3.deleteObject({ Bucket: this.BUCKET, Key: splitUrl[1] });
      return;
    } catch (error) {
      throw new RestError('remove failed', 400);
    }
  }

  async uploadToAWSS3(s3: S3, fileData: Express.Multer.File): Promise<any> {
    const params = {
      Bucket: this.BUCKET,
      Key: `img/${Date.now()}.${fileData.originalname.split('.')[1]}`,
      Body: fileData.buffer,
      ContentType: fileData.mimetype
    };
    fileData.originalname;

    try {
      const result = await new Upload({
        client: s3,
        params
      }).done();
      const { Key }: any = result;
      return { success: true, data: this.DOMAIN + Key };
    } catch (error) {
      throw new RestError('upload failed', 400);
    }
  }

  async getListImagesAWS(): Promise<void> {
    try {
      const s3 = this.configAWS();
      const objects = await s3.listObjects({ Bucket: this.BUCKET });
      const newDate = new Date().getTime();
      const twoDay = 17280000;
      if (objects.Contents?.length) {
        const imageObjects =
          objects.Contents?.filter((obj) => {
            if (obj.Key !== 'img/') {
              if (new Date(obj.LastModified as any).getTime() + twoDay < newDate) {
                return obj;
              }
            }
          }) ?? [];

        if (!imageObjects.length) return;

        await Promise.all(
          imageObjects.map(async (obj) => {
            await s3.deleteObject({ Bucket: this.BUCKET, Key: obj.Key as string });
            return;
          })
        );
      }
      return;
    } catch (error) {
      return;
    }
  }
}
