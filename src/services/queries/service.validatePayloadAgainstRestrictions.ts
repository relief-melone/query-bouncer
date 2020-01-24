import errorFactory from '../error/service.errors';

/**
 *
 *
 * @param {object} payload Payload user wants to save
 * @param {Array<object>} restrictions Array of restrictions for the payload
 */
const validatePayloadAgainstRestrictions = (payload: object, restrictions: object[]): void => {
  Object.keys(payload).forEach((key) => {
    // if(payload[key] instanceof Object || payload[key] instanceof Array){
    if (payload[key] instanceof Array){
      validateArrayAgainstPermissions(key, payload[key], restrictions);
    } else if (payload[key] instanceof Object) {
      if (restrictionContainsKey(key, restrictions)) {
        validatePayloadAgainstRestrictions(payload[key], restrictions.map((r) => r[key]));
      }
    } else {
      validatePrimitiveAgainstPermissions(key, payload[key], restrictions);
    }
  });
};

const validatePrimitiveAgainstPermissions = (key: string, primitive: number|string|boolean, restrictions: object[]): void => {
  const restrictedVals = findRestrictedValuesForKey(key, restrictions);
  if (restrictedVals.length > 0 && restrictedVals.indexOf(primitive) === -1){
    throw errorFactory.unauthorized('Payload does not match permissions');
  }
};

const validateArrayAgainstPermissions = (key: string, array: any[], restrictions: any[]): void => {
  const restrictedVals = findRestrictedValuesForKeyInArray(key, restrictions);
  if (restrictedVals.length === 0) return;
  for (const value of array){
    if (typeof(value) === 'object'){
      validatePayloadAgainstRestrictions(value, restrictedVals);
    } else {
      if (restrictedVals.indexOf(value) === -1) {
        throw errorFactory.unauthorized('Payload does not match permissions');
      }
    }
  }
};

const findRestrictedValuesForKey = (key: string, Restrictions: object[]): Array<string|number|boolean> =>
  Restrictions.filter((r) => typeof(r[key]) !== 'object' && r[key] !== undefined).map((r) => r[key]);

const findRestrictedValuesForKeyInArray = (key: string, Restrictions: object[]): any[] =>
  Restrictions.filter((r) => r[key] !== undefined).map((r) => r[key]).flat();

const restrictionContainsKey = (key: string, restrictions: object[]): boolean =>
  restrictions.filter((r) => Object.keys(r).indexOf(key) !== -1).length > 0;

export default validatePayloadAgainstRestrictions;
