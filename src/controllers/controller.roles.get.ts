import { NextFunction, Request, Response } from 'express';
import GetRoles from '../services/internal/service.roles.get';
import ErrorHandler from './errors/controller.errorHandler';

export default async (
  _req: Request, 
  res: Response, 
  _next: NextFunction, 
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