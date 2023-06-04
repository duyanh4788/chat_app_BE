import multer, { FileFilterCallback } from 'multer';
import { Request, Response, NextFunction } from 'express';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { SendRespone } from '../../services/success/success';
import { isDevelopment } from '../../server';
import ffmpegPath from '@ffmpeg-installer/ffmpeg';
import ffmpeg from 'fluent-ffmpeg';
import { RestError } from '../../services/error/error';
export class MulterMiddleware {
  private fileImagesFilter = (req: Request, file: Express.Multer.File, callback: FileFilterCallback) => {
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'video/mp4'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(new Error(`Unsupported file type. Only ${allowedMimeTypes.join(', ')} are allowed.`));
    }
  };

  private multerImagesMiddleware = multer({
    storage: multer.memoryStorage(),
    fileFilter: this.fileImagesFilter,
    limits: { fileSize: 10 * 1024 * 1024 }
  }).array('file', 5);

  public uploadMulter = (req: Request, res: Response, next: NextFunction) => {
    this.multerImagesMiddleware(req, res, async (err: any) => {
      try {
        if ((!req.file && !req.files) || (req.files && !Array.isArray(req.files))) {
          return new SendRespone({
            status: 'error',
            code: 404,
            message: err?.message || 'No files were uploaded.'
          }).send(res);
        }
        if (req.files && req.files.length === 0) {
          return new SendRespone({
            status: 'error',
            code: 404,
            message: err?.message || 'No files were uploaded.'
          }).send(res);
        }
        if (req.files && req.files.length > 5) {
          return new SendRespone({
            status: 'error',
            code: 404,
            message: err?.message || 'you can upload maximum 5 images.'
          }).send(res);
        }
        if (err instanceof multer.MulterError) {
          return new SendRespone({ status: 'error', code: 400, message: err.message }).send(res);
        } else if (err) {
          return new SendRespone({ status: 'error', code: 500, message: 'Internal error!' }).send(res);
        }
        if (req.file) {
          this.configFileImages(req.file, res);
        }

        if (!req.file) {
          for (let i = 0; i < req.files.length; i++) {
            const file = req.files[i];
            await this.configFileImages(file, res);
          }
        }
        next();
      } catch (error) {
        return RestError.manageServerError(res, error, false);
      }
    });
  };

  private async configFileImages(file: Express.Multer.File, res: Response) {
    if (!isDevelopment) {
      const fileName = `${Date.now()}.${file.mimetype.split('/')[1]}`;
      const filePath = this.filepath(`${file.mimetype === 'video/mp4' ? _pathFileVideo : _pathFileImages}/${fileName}`);
      if (file.mimetype === 'video/mp4') {
        ffmpeg.setFfmpegPath(ffmpegPath.path);
        const tempFilePath = `${Date.now()}.mp4`;
        fs.writeFileSync(filePath, file.buffer);
        await new Promise<void>((resolve, reject) => {
          ffmpeg(tempFilePath)
            .size('640x480')
            .on('end', () => {
              fs.unlinkSync(tempFilePath);
              resolve();
            })
            .on('error', (err) => {
              fs.unlinkSync(tempFilePath);
              reject('can not upload video!');
            })
            .saveToFile(filePath);
        });
        file.path = fileName;
      } else {
        await sharp(file.buffer)
          .resize({
            width: 800,
            height: 800,
            fit: sharp.fit.inside,
            withoutEnlargement: true
          })
          .toFile(filePath);
        file.path = fileName;
      }
    } else {
      if (file.mimetype === 'video/mp4') {
        throw new RestError('can not upload video to AWS!', 404);
      }
      const resize = await sharp(file.buffer)
        .resize({
          width: 800,
          height: 800,
          fit: sharp.fit.inside,
          withoutEnlargement: true
        })
        .toBuffer();
      file.buffer = resize;
    }
  }

  private filepath(fileName: string) {
    return path.resolve(fileName);
  }
}
