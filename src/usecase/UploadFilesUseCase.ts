import fs from 'fs';
import { RestError } from '../services/error/error';

export class UploadFilesUseCase {
  constructor() {
    this.removeFileLocal = this.removeFileLocal.bind(this);
  }

  public removeFileLocal(idImage: string): void {
    const splitFolder = idImage.split('/data_publish/')[1];
    const splitFileName = splitFolder.split('/');
    const filePath = splitFileName[0] === 'videos' ? `${_pathFileVideo}/${splitFileName[1]}` : `${_pathFileImages}/${splitFileName[1]}`;
    try {
      fs.accessSync(filePath);
      fs.unlinkSync(filePath);
    } catch (err) {
      throw new RestError('images not valid.', 404);
    }
  }
}
