import { NextFunction, Request, Response } from 'express';
import ConfigMain from '../configs/config.main';
import GetRoleAssignmentsForUser from '../services/queries/service.getRoleAssignmentsForUser';
import ErrorHandler from './errors/controller.errorHandler';

export default async (
  req: Request, 
  res: Response, 
  _: NextFunction, 
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