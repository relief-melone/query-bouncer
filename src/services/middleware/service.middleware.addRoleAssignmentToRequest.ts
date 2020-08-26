import { Request, Response, NextFunction } from 'express';
import  { Right }  from '../../interfaces/interface.Permission';
import GetRoleAssignment from '../../services/internal/service.roleAssignments.getById';
import RoleAssignmentById from '@/interfaces/interface.RoleAssignment';


export default (getRoleAssignmentById = GetRoleAssignment)=>async (
  req: Request, 
  res: Response, 
  next: NextFunction,
): Promise<void>=>
{
  const right = convertMethodToRight(req.method); 
  const roleAssignment = await getRoleAssignment(right, req, getRoleAssignmentById);
  req.roleAssignment = roleAssignment;
  next();
};

const getIdFromDeleteRequest=(req): string=>{
  return req.path.split('/').pop();
};

const MethodToRight = {
  'PUT': Right.update,
  'DELETE': Right.delete,
  'GET' : Right.read,
  'POST': Right.create
};

function convertMethodToRight(method: string): Right {
  return MethodToRight[method];
}

async function getRoleAssignment(
  right: Right, 
  req: Request, 
  getRoleAssignment: (id: string) => Promise<RoleAssignmentById | null>
): Promise<RoleAssignmentById> {
  return right != Right.delete ? req.body : await getRoleAssignment(getIdFromDeleteRequest(req));
}
