import fs from 'fs';
import { RestError } from '../services/error/error';

export class UploadFilesUseCase {
  constructor() {
    this.removeImageBucketAWS = this.removeImageBucketAWS.bind(this);
  }

  public removeImageBucketAWS(idImage: string): void {
    const split = idImage.split('/public/images/')[1];
    fs.access(`${_pathFile}/${split}`, (err) => {
      if (err) {
        throw new RestError('images not valid.', 404);
      }
    });
    fs.unlink(`${_pathFile}/${split}`, (err) => {
      if (err) {
        throw new RestError('images not valid.', 404);
      }
    });
    return;
  }
}
