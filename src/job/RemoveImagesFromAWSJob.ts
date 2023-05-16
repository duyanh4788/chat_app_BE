import { AWS3Services } from '../services/aws/AwsServices';
import { logger } from '../services/loggerservice/Logger';
import { BaseJob } from './BaseJob';

export class RemoveImagesFromAWSJob extends BaseJob {
  JOB_INTERVAL: number = 240000 * 360; // 24h

  aWS3Services: AWS3Services = new AWS3Services();
  constructor() {
    super();
  }

  async job(): Promise<any> {
    if (process.env.STATUS_REMOVE_AWS !== 'OFF') {
      const t0 = performance.now();
      try {
        await this.aWS3Services.getListImagesAWS();
      } catch (error) {
        logger.error('RemoveImagesFromAWSJob error', { error: error });
      }
      const t1 = performance.now();
      logger.info(`RemoveImagesFromAWSJob: Ending RemoveImagesFromAWSJob`, { time: t1 - t0 });
    }
  }
}
