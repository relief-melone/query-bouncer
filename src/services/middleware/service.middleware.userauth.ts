import { Request, Response, NextFunction } from 'express';
import errorFactory from '../error/service.errors';
import ConfigMain from '../../configs/config.main';
import errorHandler from '../../controllers/errors/controller.errorHandler';
import AuthRoleAssignment from '../auth/service.auth.roleAssignment';
import  { Right }  from '../../interfaces/interface.Permission';


export default async (req: Request, res: Response, next: NextFunction,configMain = ConfigMain, authRoleAssignment = AuthRoleAssignment): Promise<void>=>
{
  const roleAssignment = req.body;
  const user = (req as any).user;
  const userid = user? user[configMain.userPrimaryKey]:'';
  const token = req.headers.authorization;
  const right = MethodToRight[req.method];  
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
