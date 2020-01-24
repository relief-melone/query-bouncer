import { Request, Response, NextFunction } from 'express';
import errorFactory from '../services/error/service.errors';

import ErrorHandler from './errors/controller.errorHandler';
import UpdateRole from '../services/internal/service.roles.update';
import PermissionModel from '../models/model.internalPermission';
import Role from '../interfaces/interface.Role';
export default async (
  req: Request, 
  res: Response, 
  next: NextFunction, 
  errorHandler= ErrorHandler,
  updateRole = UpdateRole,
  permissionModel = PermissionModel
): Promise<Response> => {
  try {
    const role = req.body as Role;
    const roleTitle = req.params.title;
    const permissions = await Promise.all(role.Permissions.map(id=>permissionModel.findById(id)));
    if(permissions.some(t=>!t)){
      return errorHandler(errorFactory.badAttributeInput('No Permission with that _id was found!'), res);
    }
    const updatedRole = await updateRole(roleTitle,role);
    return res.status(200).json(updatedRole);
  } catch (err) {
    return errorHandler(err, res);
  }
};