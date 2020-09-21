import createError from '../../services/error/service.errors';
import { Response } from 'express';
import { Err } from '../../classes/class.Error';
import IErrorHandler from '../../interfaces/interface.ErrorHandler';


const isHttpError = (err): boolean => {
  let itIs = false;
  if (err.code !== undefined && err.msg !== undefined) {
    if (err.code.toString().length === 3) {
      itIs = true;
    }
  }
  return itIs;
};

const handleNonHttpError = (err, res: Response): Response => {
  let error;
  if (err._message) {
    if (err._message.indexOf('validation failed') !== 1) {
      error = createError.validationFailed(err);
    }
  }
  if (err.name === 'MongoError') {
    if (err.driver === true && err.message.indexOf('file with id ') !== -1 && err.message.indexOf('not opened for writing') !== -1) {
      error = createError.documentNotFound({ err });
    }
    if (err.code === 11000) {
      error = createError.alreadyExists({ message: err.message });
    }
  }
  if (!error) {
    error = createError.internalServerError(err);
  }

  return res.status(error.code).json(error);
};

const handleHttpError = (err, res: Response): Response => {
  return res.status(err.code).json(err);
};

/**
 * @param  {Error} err The Error you want to be handled
 * @param  {Object} res Response of your express app;
 */
const handleError: IErrorHandler = (err, res: Response): Response => {
  if(err instanceof Err) return res.status(err.code).json(err);
      
  if(isHttpError(err)){
    return handleHttpError(err, res);
  } else {
    return handleNonHttpError(err, res);
  }
};



export default handleError;