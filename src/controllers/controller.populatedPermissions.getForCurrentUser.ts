import { Request, Response } from 'express';
import ErrorHandler from './errors/controller.errorHandler';
import configMain from '../configs/config.main';
import Permission from '../interfaces/interface.Permission';

export default(  getPopulatedPermissionForCurrentUser: (user: string|null) => Promise<Permission[]>, errorHandler = ErrorHandler)=>
  async ( req: Request, res: Response ): Promise<Response> => {
    const user = (req as any).user;
    const username = user? user[configMain.userPrimaryKey] :null;
    try {
      const permissions = await getPopulatedPermissionForCurrentUser(username);
      return res.status(200).json(permissions);
    } catch (err) {
      return errorHandler(err, res);
    }
  };