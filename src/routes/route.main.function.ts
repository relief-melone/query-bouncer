import { Request, Response, NextFunction } from 'express';
import { Right } from '../interfaces/interface.Permission';
import validateRight from '../services/validation/service.validateRight';
import errorFactory from '../services/error/service.errors';

export default (
  req: Request, 
  res: Response, 
  next: NextFunction, 
  queryController, 
  payloadController, 
  payloadAndQueryController
): Response => {
  let right;
  try {
    right = validateRight(req.params.Right);
  } catch (err) {
    return res.status(400).json(errorFactory.badAttributeInput('Please provide either read, create, delete or update as Right'));
  }

  switch(right){
    case Right.read:
    case Right.delete:
      return queryController(req,res,next);
    case Right.create:
      return payloadController(req,res,next);
    case Right.update:
      return payloadAndQueryController(req,res,next);
    default:
      return res.status(400).json(errorFactory.badAttributeInput('Please provide either read, create, delete or update as Right'));
  }
};