import express from 'express';
import controllerCreate from '../controllers/controller.roleAssignment.create';
import controllerDelete from '../controllers/controller.roleAssignment.delete';
import controllerUpdate from '../controllers/controller.roleAssignment.update';
import controllerGet from '../controllers/controller.roleAssignment.get';
import controllerGetForCurrentUser from '../controllers/controller.roleAssignment.getForCurrentUser';
import userAuth from '../services/middleware/service.middleware.userauth';
import addRoleAssignmentToRequest from '../services/middleware/service.middleware.addRoleAssignmentToRequest';
import logRoleAssignmentChange,{ isGetOrNoSucess } from '../services/middleware/services.middleware.logRoleAssignmentChange';
import morgan from 'morgan';
import RoleAssignment from '@/interfaces/interface.RoleAssignment';

declare module 'express-serve-static-core' {
  interface Request {
    roleAssignment: RoleAssignment;
  }
}

const router = express.Router();

router.use(morgan(logRoleAssignmentChange(),{
  skip: isGetOrNoSucess }
));

router.use(addRoleAssignmentToRequest());
router.use(userAuth());

router.post('/', controllerCreate);
router.put('/:id', controllerUpdate);
router.get('/', controllerGet);
router.get('/currentuser', controllerGetForCurrentUser);
router.get('/myRoleAssignments', controllerGetForCurrentUser);
router.delete('/:id', controllerDelete);
export default router;