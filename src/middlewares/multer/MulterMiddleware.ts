import multer, { FileFilterCallback } from 'multer';
import { Request, Response, NextFunction } from 'express';
import sharp from 'sharp';
import { SendRespone } from '../../services/success/success';
export class MulterMiddleware {
  private fileFilter = (req: Request, file: Express.Multer.File, callback: FileFilterCallback) => {
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(
        new Error(`Unsupported file type. Only ${allowedMimeTypes.join(', ')} are allowed.`)
      );
    }
  };

  private multerMiddleware = multer({
    storage: multer.memoryStorage(),
    fileFilter: this.fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }
  }).single('file');

  public uploadMulter = (req: Request, res: Response, next: NextFunction) => {
    this.multerMiddleware(req, res, async (err: any) => {
      if (!req.file) {
        return new SendRespone({
          status: 'error',
          code: 404,
          message: err.message || 'please try again later.'
        }).send(res);
      }
      if (err instanceof multer.MulterError) {
        return new SendRespone({ status: 'error', code: 400, message: err.message }).send(res);
      } else if (err) {
        return new SendRespone({ status: 'error', code: 500, message: 'Internal error!' }).send(
          res
        );
      }

      const resize = await sharp(req.file.buffer)
        .resize({
          width: 800,
          height: 800,
          fit: sharp.fit.inside,
          withoutEnlargement: true
        })
        .toBuffer();

      req.file.buffer = resize;

      next();
    });
  };
}
