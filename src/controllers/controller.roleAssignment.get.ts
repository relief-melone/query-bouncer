import { NextFunction, Request, Response } from 'express';
import ConfigMain from '../configs/config.main';
import GetRoleAssignments from '../services/internal/service.roleAssignments.get';
import ErrorHandler from './errors/controller.errorHandler';

export default async (
  _req: Request, 
  res: Response, 
  _next: NextFunction,
  errorHandler= ErrorHandler,
  getRoleAssignments = GetRoleAssignments,
  configMain = ConfigMain
): Promise<Response> => {
  try {
    const roleAssignments = await getRoleAssignments();
    if(configMain.forceUserToLowerCase){
      roleAssignments.forEach(ra=>ra.User = ra.User.toLowerCase());
    }
    return res.status(200).json(roleAssignments);
  } catch (err) {
    return errorHandler(err, res);
  }
};