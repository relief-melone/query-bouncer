import { Request, Response, NextFunction } from 'express';
import errorFactory from '../services/error/service.errors';
import ErrorHandler from './errors/controller.errorHandler';
import CreateRoleAssignment from '../services/internal/service.roleAssignments.create';
import RoleModel from '../models/model.role';
import GetRoleById from '../services/queries/service.getRoleByTitle';

export default async (
  req: Request, 
  res: Response, 
  next: NextFunction, 
  errorHandler= ErrorHandler,
  createRoleAssignment = CreateRoleAssignment,
  getRoleById= GetRoleById,
  roleModel=RoleModel,
): Promise<Response> => {
  try {
    const roleAssignment = req.body;
    const role = await getRoleById(roleAssignment.Role, roleModel);
    if(!role){
      return errorHandler(errorFactory.badAttributeInput('This Role does not exist!'), res);
    }
    const createdRoleAssignment = await createRoleAssignment(roleAssignment);
    return res.status(201).json(createdRoleAssignment);
  } catch (err) {
    return errorHandler(err, res);
  }
};