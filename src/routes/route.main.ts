import express from 'express';
import routeFunction from './route.main.function';
import QueryController from '../controllers/controller.query';
import PayloadController from '../controllers/controller.payload';
import QueryAndPayloadController from '../controllers/controller.payloadAndQuery';

const router = express.Router();

router.put('/:Collection/:Right', (req,res,next) => routeFunction(req,res,next,QueryController,PayloadController, QueryAndPayloadController));

export default router;