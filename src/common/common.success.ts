import { Response } from 'express';

export const sendRespone = (res: Response, status: string, code: number, data: any, message: string) => {
    return res.status(code).json({ status, code, data, message });
}