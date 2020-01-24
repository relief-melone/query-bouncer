import { Err } from '../../classes/class.Error';

const badEndpoint = function(Details): Err{
  return new Err(400, 'The payload does not match the endpoint', Details);
};

const documentNotFound = function(Details): Err {
  return new Err(404, 'The requested Document could not be found', Details);
};

const validationFailed = function(Details): Err {
  return new Err(400, 'The Validation of your data failed', Details);
};

const internalServerError = function(Details): Err {
  return new Err(500, 'Internal Server Error', Details);
};

const badAttributeInput = function(Details): Err {
  return new Err(400, 'Bad Input for Attributes', Details);
};

const unauthorized = function(Details): Err{
  return new Err(403, 'Unauthorized', Details);
};

const createError = {
  badEndpoint,
  documentNotFound,
  validationFailed,
  internalServerError,
  badAttributeInput,
  unauthorized
};

export default createError;