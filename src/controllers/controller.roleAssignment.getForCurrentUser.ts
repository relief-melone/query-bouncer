import { Request, Response, NextFunction } from 'express';
import ErrorHandler from './errors/controller.errorHandler';
import GetRoleAssignmentsForUser from '../services/queries/service.getRoleAssignmentsForUser';
import ConfigMain from '../configs/config.main';

export default async (
  req: Request, 
  res: Response, 
  next: NextFunction, 
  errorHandler= ErrorHandler,
  getRoleAssignmentForUser = GetRoleAssignmentsForUser,
  configMain = ConfigMain
): Promise<Response> => {
  try {
    const user = (req as any).user[configMain.userPrimaryKey];
    const roleAssignments = await getRoleAssignmentForUser(user);
    if(configMain.forceUserToLowerCase){
      roleAssignments.forEach(ra=>ra.User = ra.User.toLowerCase());
    }
    return res.status(200).json(roleAssignments);
  } catch (err) {
    return errorHandler(err, res);
  }
};