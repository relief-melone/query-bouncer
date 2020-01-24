import { Request, Response } from 'express';
import ErrorHandler from './errors/controller.errorHandler';
import errorFactory from '../services/error/service.errors';

export default (  deletePermission ,errorHandler = ErrorHandler ) => 
  async ( req: Request, res: Response): Promise<Response> =>  {
    try {
      const title = req.params.title;
      const permission = await deletePermission(title);
      if(!permission){
        return errorHandler(errorFactory.documentNotFound({ Document:title }), res);
      }
      return res.status(200).json(permission);
    } catch (err) {
      return errorHandler(err, res);
    }
  };