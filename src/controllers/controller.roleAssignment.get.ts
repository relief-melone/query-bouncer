import { Request, Response, NextFunction } from 'express';
import ErrorHandler from './errors/controller.errorHandler';
import GetRoleAssignment from '../services/internal/service.roleAssignments.get';
import ConfigMain from '../configs/config.main';

export default async (
  req: Request, 
  res: Response, 
  next: NextFunction, 
  errorHandler= ErrorHandler,
  getRoleAssignment = GetRoleAssignment,
  configMain = ConfigMain
): Promise<Response> => {
  try {
    const roleAssignments = await getRoleAssignment();
    if(configMain.forceUserToLowerCase){
      roleAssignments.forEach(ra=>ra.User = ra.User.toLowerCase());
    }
    return res.status(200).json(roleAssignments);
  } catch (err) {
    return errorHandler(err, res);
  }
};