
import { NextFunction, Request, Response } from 'express';
import ConfigMain from '../../configs/config.main';
import errorHandler from '../../controllers/errors/controller.errorHandler';
import isAdmin from '../auth/service.auth.admin';
import errorFactory from '../error/service.errors';


export default async (req: Request, res: Response, next: NextFunction,configMain = ConfigMain ): Promise<void>=>
{
  const token = req.headers.authorization ? req.headers.authorization.replace('Bearer ', '') : null;
  if (!isAdmin(token, configMain)) { 
    errorHandler(errorFactory.unauthorized('Invalid Authorization information!'), res);
  } else{
    next();
  }
};