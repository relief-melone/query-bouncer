import { Request, Response, NextFunction } from 'express';
import errorFactory from '../error/service.errors';
import ConfigMain from '../../configs/config.main';
import errorHandler from '../../controllers/errors/controller.errorHandler';
import AuthRoleAssignment from '../auth/service.auth.roleAssignment';
import  { Right }  from '../../interfaces/interface.Permission';


export default (configMain = ConfigMain, 
  authRoleAssignment = AuthRoleAssignment)=>async (
  req: Request, 
  res: Response, 
  next: NextFunction,
): Promise<void>=>
{
  const user = (req as any).user;
  const userid = user? user[configMain.userPrimaryKey]:'';
  const token = req.headers.authorization;
  const right = convertMethodToRight(req.method); 
  const roleAssignment = req.roleAssignment;

  if(!await authRoleAssignment(roleAssignment, right, token, userid)){
    errorHandler(errorFactory.unauthorized('Invalid Authorization information!'), res);
  }else{
    next();
  };
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


