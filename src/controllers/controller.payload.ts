import { Request, Response, NextFunction } from 'express';
import MainConfig from '../configs/config.main';
import getRoleAssignmentsForUser from '../services/queries/service.getRoleAssignmentsForUser';
import getRoleByTitle from '../services/queries/service.getRoleByTitle';
import getPermissions from '../services/queries/service.getBusinessPermissionsByTitles';
import errorHandler from '../controllers/errors/controller.errorHandler';

import controllerFunction from './controller.payload.function';

export default async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  controllerFunction(req, res, next, MainConfig, getRoleAssignmentsForUser, getRoleByTitle, getPermissions, errorHandler);
};