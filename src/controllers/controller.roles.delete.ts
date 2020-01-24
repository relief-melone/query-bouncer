import { Request, Response, NextFunction } from 'express';
import ErrorHandler from './errors/controller.errorHandler';
import DeleteRole from '../services/internal/service.roles.delete';

export default async (
  req: Request, 
  res: Response, 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction, 
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