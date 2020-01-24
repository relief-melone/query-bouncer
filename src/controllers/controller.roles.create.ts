import { Request, Response, NextFunction } from 'express';
import errorFactory from '../services/error/service.errors';

import ErrorHandler from './errors/controller.errorHandler';
import CreateRole from '../services/internal/service.roles.create';
import GetPermissionByTitle from '../services/internal/service.allPermissions.getByTitle';
import Role from '../interfaces/interface.Role';
export default async (
  req: Request, 
  res: Response, 
  next: NextFunction, 
  errorHandler= ErrorHandler,
  createRole = CreateRole,
  getPermissionByTitle = GetPermissionByTitle
): Promise<Response> => {
  try {
    
    const role = req.body as Role;
    const permissions = await Promise.all(role.Permissions.map(title => getPermissionByTitle(title)));
    if(permissions.some(t=>!t)){
      return errorHandler(errorFactory.badAttributeInput('At least one Permission was not found'), res);
    }
    const createdRole = await createRole(role);
    return res.status(201).json(createdRole);
  } catch (err) {
    return errorHandler(err, res);
  }
};