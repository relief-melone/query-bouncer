import { NextFunction, Request, Response } from 'express';
import DeleteRole from '../services/internal/service.roles.delete';
import ErrorHandler from './errors/controller.errorHandler';

export default async (
  req: Request, 
  res: Response, 
  _: NextFunction, 
  errorHandler = ErrorHandler,
  deleteRole = DeleteRole
): Promise<Response> =>  {
  try {
    const role = await deleteRole(req.params.title);
    return res.status(200).json(role);
  } catch (err) {
    return errorHandler(err, res);
  }
};