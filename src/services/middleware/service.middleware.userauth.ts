import { Request, Response, NextFunction } from 'express';
import errorFactory from '../error/service.errors';
import ConfigMain from '../../configs/config.main';
import errorHandler from '../../controllers/errors/controller.errorHandler';
import AuthRoleAssignment from '../auth/service.auth.roleAssignment';
import  { Right }  from '../../interfaces/interface.Permission';
import GetRoleAssignment from '../../services/internal/service.roleAssignments.getById';


export default async (req: Request, res: Response, next: NextFunction,configMain = ConfigMain, authRoleAssignment = AuthRoleAssignment, getRoleAssignment = GetRoleAssignment): Promise<void>=>
{
  // const roleAssignment = req.body;
  const user = (req as any).user;
  const userid = user? user[configMain.userPrimaryKey]:'';
  const token = req.headers.authorization;
  const right = MethodToRight[req.method]; 
  const roleAssignment = right!=Right.delete? req.body: await getRoleAssignment(getIdFromDeleteRequest(req));
  
  if(!await authRoleAssignment(roleAssignment, right, token, userid)){
    errorHandler(errorFactory.unauthorized('Invalid Authorization information!'), res);
  }else{
    next();
  };
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
