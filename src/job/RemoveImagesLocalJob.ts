import { config } from '../config';
import { logger } from '../services/loggerservice/Logger';
import { BaseJob } from './BaseJob';
import fs from 'fs';

export class RemoveFileLocalJob extends BaseJob {
  JOB_INTERVAL: number = 240000 * 360; // 24h

  constructor() {
    super();
  }

  async job(): Promise<any> {
    if (config.STATUS_REMOVE_LOCAL !== 'OFF') {
      const t0 = performance.now();
      const listFileImagesPath = `${_pathFileImages}`;
      const listFileVideoPath = `${_pathFileVideo}`;
      const newDate = new Date().getTime();
      const twoDay = 17280000;
      try {
        fs.readdir(listFileImagesPath, (err: NodeJS.ErrnoException | null, files: string[]) => {
          if (err) {
            throw err;
          }
          for (let file of files) {
            if (parseInt(file.split('.')[0]) + twoDay < newDate) {
              fs.unlink(`${listFileImagesPath}/${file}`, (err) => {
                if (err) {
                  logger.error('RemoveFileLocalJob error', {
                    error: `can not remove file:::: ${file}`
                  });
                }
                console.log(`RemoveFileLocalJob: hass remove file:::: ${file}`);
              });
            }
          }
        });
        fs.readdir(listFileVideoPath, (err: NodeJS.ErrnoException | null, files: string[]) => {
          if (err) {
            throw err;
          }
          for (let file of files) {
            if (parseInt(file.split('.')[0]) + twoDay < newDate) {
              fs.unlink(`${listFileVideoPath}/${file}`, (err) => {
                if (err) {
                  logger.error('RemoveFileLocalJob error', {
                    error: `can not remove file:::: ${file}`
                  });
                }
                console.log(`RemoveFileLocalJob: hass remove file:::: ${file}`);
              });
            }
          }
        });
      } catch (error) {
        logger.error('RemoveFileLocalJob error', { error: error });
        return error;
      }
      const t1 = performance.now();
      logger.info(`RemoveFileLocalJob: Ending RemoveFileLocalJob`, { time: t1 - t0 });
    }
  }
}
