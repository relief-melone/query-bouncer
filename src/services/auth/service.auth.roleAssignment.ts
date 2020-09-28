import ConfigMain from '../../configs/config.main';
import { Right } from '../../interfaces/interface.Permission';
import IRoleAssignment from '../../interfaces/interface.RoleAssignment';
import InternalRoleAssignment from '../../models/model.roleAssignment';
import populateInputRestrictions from '../input/service.populateInputRestrictions';
import GetInternalPermissions from '../internal/service.getInternalPermissionsBy';
import GetRoleAssignmentsForUser from '../queries/service.getRoleAssignmentsForUser';
import GetRoleByTitle from '../queries/service.getRoleByTitle';
import validatePayloadAgainstRestrictions from '../queries/service.validatePayloadAgainstRestrictions';
import isAdmin from './service.auth.admin';

export default async (
  roleAssignment: IRoleAssignment, 
  action: Right, 
  token: string | undefined, 
  user: string, 
  mainConfig = ConfigMain,
  getRoleAssignmentsForUser = GetRoleAssignmentsForUser,
  getRoleByTitle = GetRoleByTitle,
  getInternalPermissions = GetInternalPermissions,
  internalRoleAssignment = InternalRoleAssignment,
): Promise<boolean> => {
  if(isAdmin(token, mainConfig)) return true;
  
  try {
    const roleAssignmentsOfUser = await getRoleAssignmentsForUser(user);
    const allRestrictions = (await Promise.all(roleAssignmentsOfUser.map(async roleAssignment => {
      const role = await getRoleByTitle(roleAssignment.Role );
      if(role){
        const permissions = await getInternalPermissions(
          action, 
          internalRoleAssignment.collection.name, 
          role.Permissions, 
        );
        return populateInputRestrictions(permissions, roleAssignment.Data);
      }
    }))).flat();

    validatePayloadAgainstRestrictions(roleAssignment, allRestrictions);
    return !(allRestrictions.length === 0);

  } catch (err) {
    return false;
  }
};