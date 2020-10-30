import { NextFunction, Request, Response } from 'express';
import populateInputRestrictions from '../services/input/service.populateInputRestrictions';
import validatePayloadAgainstRestrictions from '../services/queries/service.validatePayloadAgainstRestrictions';
import validateRight from '../services/validation/service.validateRight';

export default async (
  req: Request, 
  res: Response, 
  _: NextFunction, 
  mainConfig, 
  getRoleAssignmentsForUser, 
  getRoleByTitle, 
  getPermissions, 
  errorHandler
): Promise<Response> => {
  const user =  req.user ? req.user[mainConfig.userPrimaryKey] : null;
  const collection = req.params.Collection;
  const right = validateRight(req.params.Right);
  const payload = req.body.payload;
    
  try {
    const roleAssignments = await getRoleAssignmentsForUser(user);

    const populatedPermissions: any[] = (await Promise.all(roleAssignments.map(async roleAssignment => {
      const role = await getRoleByTitle(roleAssignment.Role);
      if(role){
        const permissions = await getPermissions(right, collection, role.Permissions);
        return await populateInputRestrictions(permissions, roleAssignment.Data);
      } else {
        return [];
      }
    }))).flat();
    
    validatePayloadAgainstRestrictions(payload, populatedPermissions);
    return res.status(200).json({
      payload
    });
    
  } catch (err) {
    return errorHandler(err, res);
  }    
};