import validateRight from '../services/validation/service.validateRight';

import populatePermissionQueries from '../services/queries/service.populatePermissionQueries';
import combinePermissionsAndQuery from '../services/queries/service.combinePermissionsAndQuery';

import errorFactory from '../services/error/service.errors';
import { Request, Response, NextFunction } from 'express';

import MainConfig from '../configs/config.main';
import GetRoleAssignmentsForUser from '../services/queries/service.getRoleAssignmentsForUser';
import GetRoleByTitle from '../services/queries/service.getRoleByTitle';
import GetPermissions from '../services/queries/service.getBusinessPermissionsByTitles';

export const QueryController = async (
  req: Request, 
  res: Response, 
  next: NextFunction, 
  mainConfig, 
  getRoleAssignmentsForUser,
  getRoleByTitle,
  getPermissions,
): Promise<Response> => {
  const user: string | null = (req as any).user ? (req as any).user[mainConfig.userPrimaryKey] : null;
  const collection = req.params.Collection;
  const right = validateRight(req.params.Right);
  if(!req.body.query)
    // Remove option to pass request without query with upcoming major relase
    console.log('Sending query directly in body is deprecated. Please nest in query Object');
  
  const query = req.body.query ? req.body.query : req.body;

  const roleAssignments = await getRoleAssignmentsForUser(user);

  const populatedPermissions: any[] = (await Promise.all(roleAssignments.map(async roleAssignment => {
    const role = await getRoleByTitle(roleAssignment.Role);
    if(role){
      const permissions = await getPermissions(right, collection, role.Permissions);
      return populatePermissionQueries(permissions, roleAssignment.Data);
    } else {
      return [];
    }
  }))).flat();
    
  if(populatedPermissions.length === 0){
    return res.status(403).json(errorFactory.unauthorized('No Permission was found'));
  } 
  return res.status(200).json({
    query: combinePermissionsAndQuery(query, populatedPermissions)
  });
};

export default async (
  req: Request, 
  res: Response, 
  next: NextFunction, 
): Promise<void> => {
  QueryController(req, res, next, MainConfig, GetRoleAssignmentsForUser, GetRoleByTitle, GetPermissions);
};