import fs from 'fs';
import { RestError } from '../services/error/error';

export class UploadFilesUseCase {
  constructor() {
    this.removeImageBucketAWS = this.removeImageBucketAWS.bind(this);
  }

  public removeImageBucketAWS(idImage: string): void {
    const split = idImage.split('/public/images/')[1];
    const filePath = `${_pathFile}/images/${split}`;
    try {
      fs.accessSync(filePath);
      fs.unlinkSync(filePath);
    } catch (err) {
      throw new RestError('images not valid.', 404);
    }
  }
}
