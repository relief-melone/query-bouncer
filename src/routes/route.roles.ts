import express from 'express';
import rolesCreateController from '../controllers/controller.roles.create';
import rolesGetController from '../controllers/controller.roles.get';
import rolesDeleteControler from '../controllers/controller.roles.delete';
import rolesUpdateController from '../controllers/controller.roles.update';
import tokenChecker from '../services/middleware/service.middleware.tokenauth';

const router = express.Router();

router.use('/', tokenChecker);

router.post('/', rolesCreateController);
router.put('/:title', rolesUpdateController );
router.get('/', rolesGetController);
router.delete('/:title', rolesDeleteControler );
export default router;