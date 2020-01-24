import { Request, Response, NextFunction } from 'express';
import ErrorHandler from './errors/controller.errorHandler';
import GetRoles from '../services/internal/service.roles.get';

export default async (
  req: Request, 
  res: Response, 
  next: NextFunction, 
  errorHandler = ErrorHandler,
  getRoles = GetRoles,
): Promise<Response> => {

  try {
    const roles = await getRoles();
    return res.status(200).json(roles);
  } catch (err) {
    return errorHandler(err, res);
  }
};