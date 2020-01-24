import { Request, Response, NextFunction } from 'express';
import ErrorHandler from './errors/controller.errorHandler';
import GetRoleAssignment from '../services/internal/service.roleAssignments.get';

export default async (
  req: Request, 
  res: Response, 
  next: NextFunction, 
  errorHandler= ErrorHandler,
  getRoleAssignment = GetRoleAssignment,
): Promise<Response> => {
  try {
    const roleAssignments = await getRoleAssignment();
    return res.status(200).json(roleAssignments);
  } catch (err) {
    return errorHandler(err, res);
  }
};