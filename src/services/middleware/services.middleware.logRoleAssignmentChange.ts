import RoleAssignment from '@/interfaces/interface.RoleAssignment';
import { Request, Response } from 'express';
import ConfigMain from '../../configs/config.main';
import Logger from '../services.logger';

export default (logger = Logger, configMain = ConfigMain)=>(
  _,
  req: Request
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