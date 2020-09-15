import { Request, Response } from 'express';
import Role from '../interfaces/interface.Role';
import errorFactory from '../services/error/service.errors';
import GetPermissionByTitle from '../services/internal/service.allPermissions.getByTitle';
import CreateRole from '../services/internal/service.roles.create';
import ErrorHandler from './errors/controller.errorHandler';

export default async (
  req: Request, 
  res: Response, 
  _, 
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