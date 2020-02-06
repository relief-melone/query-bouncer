import errorFactory from '../error/service.errors';

/**
 *
 *
 * @param {object} payload Payload user wants to save
 * @param {Array<object>} restrictions Array of restrictions for the payload
 */
export default (payload: object, restrictions: object[]): void => {
  if(!validatePayloadAgainstRestrictions(payload, restrictions)){
    throw errorFactory.unauthorized('Payload does not match permissions');
  }
};

const validatePayloadAgainstRestrictions = (payload: object, restrictions: object[]): boolean => {
  return restrictions.some(r=>validatePayloadAgainstSingleRestriction(payload, r));
};

const validatePayloadAgainstSingleRestriction = (payload: object, restriction: object): boolean => {
  return Object.keys(restriction).every(key=>
    ((): boolean=>{
      switch(true){
        case restriction[key] instanceof Array: 
          return payload[key].every(element=>{
            if(element instanceof Object) return validatePayloadAgainstRestrictions(element, restriction[key]);
            else return restriction[key].includes(element);
          });
        case restriction[key] instanceof Object: 
          return validatePayloadAgainstSingleRestriction(payload[key], restriction[key]);
        default: 
          return restriction[key]===payload[key];
      }
    })()
  );

};

