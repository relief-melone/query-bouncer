import RoleAssignment from '@/interfaces/interface.RoleAssignment';
import express from 'express';
import morgan from 'morgan';
import controllerCreate from '../controllers/controller.roleAssignment.create';
import controllerDelete from '../controllers/controller.roleAssignment.delete';
import controllerGet from '../controllers/controller.roleAssignment.get';
import controllerGetForCurrentUser from '../controllers/controller.roleAssignment.getForCurrentUser';
import controllerUpdate from '../controllers/controller.roleAssignment.update';
import addRoleAssignmentToRequest from '../services/middleware/service.middleware.addRoleAssignmentToRequest';
import userAuth from '../services/middleware/service.middleware.userauth';
import logRoleAssignmentChange, { isGetOrNoSucess } from '../services/middleware/services.middleware.logRoleAssignmentChange';

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
router.get('/currentuser', controllerGetForCurrentUser);
router.get('/myRoleAssignments', controllerGetForCurrentUser);

router.use(userAuth());
router.post('/', controllerCreate);
router.put('/:id', controllerUpdate);
router.get('/', controllerGet);

router.delete('/:id', controllerDelete);
export default router;