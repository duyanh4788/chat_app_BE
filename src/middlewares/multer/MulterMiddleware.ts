import multer, { FileFilterCallback } from 'multer';
import { Request, Response, NextFunction } from 'express';

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
        limits: { fileSize: 2 * 1024 * 1024 }
    }).single('file');

    public uploadMulter = (req: Request, res: Response, next: NextFunction) => {
        this.multerMiddleware(req, res, (err: any) => {
            if (!req.file) return res.status(404).json({ message: 'please input file.' });
            if (err instanceof multer.MulterError) {
                return res.status(400).json({ message: err.message });
            } else if (err) {
                return res.status(500).json({ message: 'Internal error' });
            }
            next();
        });
    };

}