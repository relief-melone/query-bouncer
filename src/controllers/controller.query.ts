import validateRight from '../services/validation/service.validateRight';

import populatePermissionQueries from '../services/queries/service.populatePermissionQueries';
import combinePermissionsAndQuery from '../services/queries/service.combinePermissionsAndQuery';

import errorFactory from '../services/error/service.errors';
import { Request, Response, NextFunction } from 'express';

import MainConfig from '../configs/config.main';
import GetRoleAssignmentsForUser from '../services/queries/service.getRoleAssignmentsForUser';
import GetRoleByTitle from '../services/queries/service.getRoleByTitle';
import GetPermissions from '../services/queries/service.getBusinessPermissionsByTitles';
import logger from '@/services/log/logger';

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
  const query = req.body;

  logger.debug('Controller Query - Handling Request...', {
    user,
    collection,
    right,
    query,
    location: 'controllers/controller.query'
  });

  try {
    const roleAssignments = await getRoleAssignmentsForUser(user);

    logger.debug('Controller Query - RoleAssignments', {
      roleAssignments
    });

    const populatedPermissions = (await Promise.all(roleAssignments.map(async roleAssignment => {
      const role = await getRoleByTitle(roleAssignment.Role);
      if(role){
        const permissions = await getPermissions(right, collection, role.Permissions);
        return populatePermissionQueries(permissions, roleAssignment.Data);
      } else {
        return [];
      }
    }))).flat();

    logger.debug('Controller Query - Populated Permissions', {
      populatedPermissions,
      location: 'controllers/controller.query'
    });
      
    if(populatedPermissions.length === 0){
      logger.verbose('Controller Query - No Permission found. Returning 403', {
        user,
        collection,
        right,
        query,
        location: 'controllers/controller.query'
      });

      return res.status(403).json(errorFactory.unauthorized('No Permission was found'));
    } 

    logger.debug('Controller Query - Permissions ');

    return res.status(200).json({
      query: combinePermissionsAndQuery(query, populatedPermissions)
    });

  } catch (err) {
    logger.error('Controller Query - Error', {
      user,
      collection,
      right,
      query,
      location: 'controllers/controller.query'
    });

    return res.status(500).send('Internal Server Error');
  }
  
};

export default async (
  req: Request, 
  res: Response, 
  next: NextFunction, 
): Promise<void> => {
  QueryController(req, res, next, MainConfig, GetRoleAssignmentsForUser, GetRoleByTitle, GetPermissions);
};