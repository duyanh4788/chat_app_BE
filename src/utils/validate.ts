import { RestError } from '../services/error/error';
import { Request } from 'express';

export const validateValue = (value: any): boolean => {
  if (!value || (value && value === '')) return false;
  return true;
};

export const validateObjectReqBody = (req: Request) => {
  if (
    req.body &&
    !Object.keys(req.body).length &&
    Object.getPrototypeOf(req.body) !== Object.prototype
  ) {
    throw new RestError('email not avalible.', 404);
  }
};
