import { Response } from 'express';
import ErrorHandler from './errors/controller.errorHandler';

export default(  getPermission, errorHandler = ErrorHandler)=>
  async ( _, res: Response ): Promise<Response> => {

    try {
      const permissions = await getPermission();
      return res.status(200).json(permissions);
    } catch (err) {
      return errorHandler(err, res);
    }
  };