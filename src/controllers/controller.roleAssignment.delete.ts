import { Request, Response, NextFunction } from 'express';
import errorFactory from '../services/error/service.errors';
import ErrorHandler from './errors/controller.errorHandler';
import DeleteRoleAssignment from '../services/internal/service.roleAssignments.delete';

export default async (
  req: Request, 
  res: Response, 
  next: NextFunction, 
  errorHandler= ErrorHandler,
  deleteRoleAssignment = DeleteRoleAssignment,
): Promise<Response> => {
  try {
    const id = req.params.id;
    const deleted = await deleteRoleAssignment(id);
    if( !deleted)
      return errorHandler(errorFactory.documentNotFound({ roleAssignmentId:id }),res);
    return res.status(200).json(deleted);
  } catch (err) {
    return errorHandler(err, res);
  }
};