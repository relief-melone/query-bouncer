import ConfigMain from '../../configs/config.main';
import { Request, Response } from 'express';
import Logger from '../services.logger';
import RoleAssignment from '@/interfaces/interface.RoleAssignment';
import { TokenIndexer } from 'morgan';

export default (logger = Logger, configMain = ConfigMain)=>(
  tokens: TokenIndexer<Request, Response>,
  req: Request,
  res: Response,
): null=>{
  const roleAssignment: RoleAssignment = req.roleAssignment;
  const userId = getUserId(req, configMain);

  const metadata = { 
    role:roleAssignment.Role,
    changedUser:roleAssignment.User,
    data: roleAssignment.Data,
    user: userId, 
    method: req.method };

  logger.info(
    createUserFriendlyMessage(metadata),metadata
  );
  return null;
};

const createUserFriendlyMessage=(metadata: any): string=>{
  switch(metadata.method){
    case 'POST': return `Role ${metadata.role} was added to user ${metadata.changedUser} by user ${metadata.user}`; 
    case 'PUT': return `Role ${metadata.role} of user ${metadata.changedUser} was changed by user ${metadata.user}`;
    case 'DELETE': return `Role ${metadata.role} of user ${metadata.changedUser} was deleted by user ${metadata.user}`; 
    default: return 'This should not happen'; 
  }
};

const getUserId =(req: Request, configMain): string=>{
  const user = (req as any).user;
  const userid = user? user[configMain.userPrimaryKey]:'';
  return userid;
};

export const isGetOrNoSucess =(req: Request, res: Response): boolean=>{
  return res.statusCode>=300||req.method=='GET';
};