import RoleAssignment from '@/interfaces/interface.RoleAssignment';
import { Request, Response } from 'express';
import ConfigMain from '../configs/config.main';
import errorFactory from '../services/error/service.errors';
import CreateRoleAssignment from '../services/internal/service.roleAssignments.create';
import GetRoleById from '../services/queries/service.getRoleByTitle';
import ErrorHandler from './errors/controller.errorHandler';

export default async (
  req: Request, 
  res: Response, 
  _, 
  errorHandler= ErrorHandler,
  createRoleAssignment = CreateRoleAssignment,
  getRoleById= GetRoleById,
  configMain = ConfigMain
): Promise<Response> => {
  try {
    const roleAssignment: RoleAssignment = req.roleAssignment;
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