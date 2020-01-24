import { Request, Response } from 'express';
import ErrorHandler from './errors/controller.errorHandler';
import Permission from '../interfaces/interface.Permission';

export default(  updatePermission,errorHandler= ErrorHandler)=> 
  async ( req: Request, res: Response ): Promise<Response> => {
    try {
      const permit = req.body as Permission;
      const title = req.params.title;
      const permission = await updatePermission(title, permit);
      return res.status(200).json(permission);
    } catch (err) {
      return errorHandler(err, res);
    }
  };