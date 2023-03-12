import { logger } from '../server';

export abstract class BaseJob {
  abstract JOB_INTERVAL: number;

  abstract job(): Promise<any>;

  public async runJob(): Promise<never> {
    while (true) {
      try {
        await this.job();
      } catch (error) {
        logger.error('BaseJob', { error: error, message: 'error running job' });
      }
      await this.deleyJob();
    }
  }

  public deleyJob() {
    return new Promise((resolve) => setTimeout(resolve, this.JOB_INTERVAL));
  }
}
