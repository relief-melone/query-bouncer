

import Permission from '../../interfaces/interface.Permission';
import populateRestriction from '../service.populateRestriction';

export default ( permissions: Array<Permission>, data: Record<string, any>): Array<any> => {
  return permissions.map(p => populateRestriction(p.PayloadRestriction, data));
};
