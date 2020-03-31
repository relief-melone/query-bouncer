import express, { Router } from 'express';
import permissionsCreateController from '../controllers/controller.permissions.create';
import permissionsGetController from '../controllers/controller.permissions.get';
import permissionsUpdateController from '../controllers/controller.permissions.update';
import permissionsDeleteControler from '../controllers/controller.permissions.delete';
import tokenChecker from '../services/middleware/service.middleware.tokenauth';
import getPopulatedPermissionsForCurrentUserController from '../controllers/controller.populatedPermissions.getForCurrentUser';

import CreatePermission from '../services/internal/service.permissions.create';
import UpdatePermission from '../services/internal/service.permissions.update';
import GetPermissions from '../services/internal/service.permissions.get';
import GetPopulatedPermissionsForUser from '../services/queries/service.getPermissionsForUser';
import DeletePermission from '../services/internal/service.permissions.delete';
import PermissionModel from '../models/model.permission';
import InternalPermissionModel from '../models/model.internalPermission';

export { createInternalPermissionRouter, createPermissionRouter };

function createPermissionRouter(): Router{
  return createPermissions(PermissionModel);
}

function createInternalPermissionRouter(): Router{
  return createPermissions(InternalPermissionModel);
}

function createPermissions(model): Router{

  const router = express.Router();
  router.get('/myPermissions',getPopulatedPermissionsForCurrentUserController(GetPopulatedPermissionsForUser(model)) );

  router.use('/', tokenChecker);
  router.post('/', permissionsCreateController(CreatePermission(model)));
  router.get('/', permissionsGetController(GetPermissions(model)));
  router.put('/:title', permissionsUpdateController(UpdatePermission(model)) );
  router.delete('/:title', permissionsDeleteControler(DeletePermission(model)) );
  return router;
}