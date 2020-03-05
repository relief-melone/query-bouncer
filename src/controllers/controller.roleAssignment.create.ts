import { Request, Response, NextFunction } from 'express';
import errorFactory from '../services/error/service.errors';
import ErrorHandler from './errors/controller.errorHandler';
import CreateRoleAssignment from '../services/internal/service.roleAssignments.create';
import GetRoleById from '../services/queries/service.getRoleByTitle';
import RoleAssignment from '@/interfaces/interface.RoleAssignment';
import ConfigMain from '../configs/config.main';

export default async (
  req: Request, 
  res: Response, 
  next: NextFunction, 
  errorHandler= ErrorHandler,
  createRoleAssignment = CreateRoleAssignment,
  getRoleById= GetRoleById,
  configMain = ConfigMain
): Promise<Response> => {
  try {
    const roleAssignment: RoleAssignment = req.body;
    const role = await getRoleById(roleAssignment.Role);
    if(!role){
      return errorHandler(errorFactory.badAttributeInput('This Role does not exist!'), res);
    }
    if(configMain.forceUserToLowerCase){
      roleAssignment.User = roleAssignment.User.toLowerCase();
    }
    const createdRoleAssignment = await createRoleAssignment(roleAssignment);
    return res.status(201).json(createdRoleAssignment);
  } catch (err) {
    return errorHandler(err, res);
  }
};