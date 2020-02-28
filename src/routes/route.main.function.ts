import { Request, Response, NextFunction } from 'express';
import { Right } from '../interfaces/interface.Permission';
import validateRight from '../services/validation/service.validateRight';
import errorFactory from '../services/error/service.errors';
import logger from '@/services/log/logger';

export default (
  req: Request, 
  res: Response, 
  next: NextFunction, 
  queryController, 
  payloadController, 
  payloadAndQueryController
): Response => {
  logger.debug('Route-Main: Receiving Request on Main Route', {
    location: 'routes/route.main.function',
    reqParams: req.param,
    reqHeaders: req.headers
  });

  let right;
  try {
    right = validateRight(req.params.Right);
  } catch (err) {
    return res.status(400).json(errorFactory.badAttributeInput('Please provide either read, create, delete or update as Right'));
  }

  switch(right){
    case Right.read:
    case Right.delete:
      logger.debug('Route-Main: Calling Query Controller', {
        location: 'routes/route.main.function',        
      });
      return queryController(req,res,next);
    case Right.create:
      logger.debug('Route-Main: Calling Payload Controller', {
        location: 'routes/route.main.function',        
      });
      return payloadController(req,res,next);
    case Right.update:
      logger.debug('Route-Main: Calling PayloadAndQuery Controller', {
        location: 'routes/route.main.function',        
      });
      return payloadAndQueryController(req,res,next);
    default:
      logger.verbose('Route-Main: Bad Request Issued', {
        location: 'routes/route.main.function',
        right        
      });
      return res.status(400).json(errorFactory.badAttributeInput('Please provide either read, create, delete or update as Right'));
  }
};