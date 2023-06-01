import multer, { FileFilterCallback } from 'multer';
import { Request, Response, NextFunction } from 'express';
import sharp from 'sharp';
import path from 'path';
import { SendRespone } from '../../services/success/success';
import { isDevelopment } from '../../server';
export class MulterMiddleware {
  private fileFilter = (req: Request, file: Express.Multer.File, callback: FileFilterCallback) => {
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(new Error(`Unsupported file type. Only ${allowedMimeTypes.join(', ')} are allowed.`));
    }
  };

  private multerMiddleware = multer({
    storage: multer.memoryStorage(),
    fileFilter: this.fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }
  }).array('file', 5);

  public uploadMulter = (req: Request, res: Response, next: NextFunction) => {
    this.multerMiddleware(req, res, async (err: any) => {
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
        this.configFile(req.file);
      }

      if (!req.file) {
        for (let i = 0; i < req.files.length; i++) {
          const file = req.files[i];
          await this.configFile(file);
        }
      }
      next();
    });
  };

  private async configFile(file: Express.Multer.File) {
    if (!isDevelopment) {
      const fileName = `${Date.now()}.${file.mimetype.split('/')[1]}`;
      const filePath = this.filepath(`${_pathFile}/${fileName}`);
      await sharp(file.buffer)
        .resize({
          width: 800,
          height: 800,
          fit: sharp.fit.inside,
          withoutEnlargement: true
        })
        .toFile(filePath);
      file.path = fileName;
    } else {
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
