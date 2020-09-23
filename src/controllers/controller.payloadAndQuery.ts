import { NextFunction, Request, Response } from 'express';
import MainConfig from '../configs/config.main';
import errorHandler from '../controllers/errors/controller.errorHandler';
import errorFactory from '../services/error/service.errors';
import populateInputRestrictions from '../services/input/service.populateInputRestrictions';
import combinePermissionsAndQuery from '../services/queries/service.combinePermissionsAndQuery';
import getPermissions from '../services/queries/service.getBusinessPermissionsByTitles';
import getRoleAssignmentsForUser from '../services/queries/service.getRoleAssignmentsForUser';
import getRoleByTitle from '../services/queries/service.getRoleByTitle';
import populateQueryRestrictions from '../services/queries/service.populatePermissionQueries';
import validatePayloadAgainstRestrictions from '../services/queries/service.validatePayloadAgainstRestrictions';
import validateRight from '../services/validation/service.validateRight';


export const PayloadAndQueryController = async (
  req: Request, 
  res: Response, 
  _: NextFunction, 
  mainConfig, 
  getRoleAssignmentsForUser, 
  getRoleByTitle, 
  getPermissions, 
  errorHandler
): Promise<Response> => {
  const user = (req as any).user[mainConfig.userPrimaryKey];
  const collection = req.params.Collection;
  const right = validateRight(req.params.Right);
  
  const payload = req.body.payload;
  const query = req.body.query;
    
  try {
    const roleAssignments = await getRoleAssignmentsForUser(user);
    const populatedInputRestrictions: any = [];
    const populatedQueryRestrictions: any = [];

    await Promise.all(roleAssignments.map(async roleAssignment => {
      const role = await getRoleByTitle(roleAssignment.Role);
      if(role){
        const permissions = await getPermissions(right, collection, role.Permissions);
        populatedInputRestrictions.push(...populateInputRestrictions(permissions, roleAssignment.Data));
        populatedQueryRestrictions.push(...populateQueryRestrictions(permissions, roleAssignment.Data));
      }
      return;
    }));
    
    validatePayloadAgainstRestrictions(payload, populatedInputRestrictions);
    if(populatedQueryRestrictions.length === 0){
      return errorHandler(errorFactory.unauthorized('No Permission was found'), res);
    }

    return res.status(200).json({
      query: combinePermissionsAndQuery(query, populatedQueryRestrictions),
      payload
    });
    
  } catch (err) {
    return errorHandler(err, res);
  }
};

export default async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  PayloadAndQueryController(req, res, next, MainConfig, getRoleAssignmentsForUser, getRoleByTitle, getPermissions, errorHandler);
};