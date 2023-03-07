import multer, { FileFilterCallback } from 'multer';
import { Request, Response, NextFunction } from 'express';
import sharp from 'sharp';
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
    }).single('file');

    public uploadMulter = (req: Request, res: Response, next: NextFunction) => {
        this.multerMiddleware(req, res, async (err: any) => {

            if (!req.file) return res.status(404).json({ message: err.message || 'please try again later.' });

            if (err instanceof multer.MulterError) {
                return res.status(400).json({ message: err.message });
            } else if (err) {
                return res.status(500).json({ message: 'Internal error' });
            }

            const resize = await sharp(req.file.buffer).resize({
                width: 800,
                height: 800,
                fit: sharp.fit.inside,
                withoutEnlargement: true,
            }).toBuffer();

            req.file.buffer = resize

            next();
        });
    };

}