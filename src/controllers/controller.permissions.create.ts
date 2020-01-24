import { Request, Response } from 'express';

import ErrorHandler from './errors/controller.errorHandler';

export default (createPermission, errorHandler = ErrorHandler) => 
  async ( req: Request, res: Response ): Promise<Response> => {
    try {
      const permission = await createPermission(req.body);
      return res.status(201).json(permission);
    } catch (err) {
      return errorHandler(err, res);
    }
  };