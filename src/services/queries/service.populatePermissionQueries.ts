

import Permission from '../../interfaces/interface.Permission';
import poulateRestriction from '../service.populateRestriction';

export default ( permissions: Array<Permission>, data: Record<string, any>): Array<any> => {
  return permissions.map(p => poulateRestriction(p.QueryRestriction, data));
};
