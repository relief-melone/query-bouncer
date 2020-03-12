import express from 'express';
import controllerCreate from '../controllers/controller.roleAssignment.create';
import controllerDelete from '../controllers/controller.roleAssignment.delete';
import controllerUpdate from '../controllers/controller.roleAssignment.update';
import controllerGet from '../controllers/controller.roleAssignment.get';
import controllerGetForCurrentUser from '../controllers/controller.roleAssignment.getForCurrentUser';
import userAuth from '../services/middleware/service.middleware.userauth';

const router = express.Router();

router.use(userAuth);

router.post('/', controllerCreate);
router.put('/:id', controllerUpdate);
router.get('/', controllerGet);
router.get('/currentuser', controllerGetForCurrentUser);
router.delete('/:id', controllerDelete);
export default router;