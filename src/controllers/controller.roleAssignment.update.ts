import { Request, Response, NextFunction } from 'express';
import errorFactory from '../services/error/service.errors';
import ErrorHandler from './errors/controller.errorHandler';
import UpdateRoleAssignment from '../services/internal/service.roleAssignments.update';
import GetRoleById from '../services/queries/service.getRoleByTitle';
import ConfigMain from '../configs/config.main';

export default async (
  req: Request, 
  res: Response, 
  next: NextFunction, 
  errorHandler= ErrorHandler,
  updateRoleAssignment = UpdateRoleAssignment,
  getRoleById= GetRoleById,
  configMain = ConfigMain
): Promise<Response> => {
  try {
    const id = req.params.id;
    const roleAssignment = req.body;
    const role = await getRoleById(roleAssignment.Role);
    if(!role){
      return errorHandler(errorFactory.badAttributeInput('This Role does not exist!'), res);
    }
    if(configMain.forceUserToLowerCase){
      roleAssignment.User = roleAssignment.User.toLowerCase();
    }
    const updatedRoleAssignment = await updateRoleAssignment(id,roleAssignment);
    if( !updatedRoleAssignment)
      return errorHandler(errorFactory.documentNotFound({ roleAssignmentId:id }),res);
    return res.status(200).json(updatedRoleAssignment);
  } catch (err) {
    return errorHandler(err, res);
  }
};