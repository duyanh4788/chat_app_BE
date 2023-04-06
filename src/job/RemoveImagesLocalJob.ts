import { logger } from '../services/loggerservice/Logger';
import { BaseJob } from './BaseJob';
import fs from 'fs';
import path from 'path';

export class RemoveImagesLocalJob extends BaseJob {
  JOB_INTERVAL: number = 240000 * 360; // 24h

  constructor() {
    super();
  }

  async job(): Promise<any> {
    const t0 = performance.now();
    const filePath = `${_pathFile}`;
    const newDate = new Date().getTime();
    const twoDay = 17280000;
    try {
      fs.readdir(filePath, (err: NodeJS.ErrnoException | null, files: string[]) => {
        if (err) {
          throw err;
        }
        for (let file of files) {
          if (parseInt(file.split('.')[0]) + twoDay < newDate) {
            fs.unlink(`${filePath}/${file}`, (err) => {
              if (err) {
                logger.error('RemoveImagesLocalJob error', {
                  error: `can not remove file:::: ${file}`
                });
              }
              console.log(`RemoveImagesLocalJob: hass remove file:::: ${file}`);
            });
          }
        }
      });
    } catch (error) {
      logger.error('RemoveImagesLocalJob error', { error: error });
      return error;
    }
    const t1 = performance.now();
    logger.info(`RemoveImagesLocalJob: Ending RemoveImagesLocalJob`, { time: t1 - t0 });
  }
}
