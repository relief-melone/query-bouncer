import { Right } from '../../interfaces/interface.Permission';
import IRoleAssignment from '../../interfaces/interface.RoleAssignment';
import isAdmin from './service.auth.admin';
import validatePayloadAgainstRestrictions from '../queries/service.validatePayloadAgainstRestrictions';
import populateInputRestrictions from '../input/service.populateInputRestrictions';
import GetRoleAssignmentsForUser from '../queries/service.getRoleAssignmentsForUser';
import GetRoleByTitle from '../queries/service.getRoleByTitle';
import GetInternalPermissions from '../internal/service.getInternalPermissionsBy';
import InternalRoleAssignment from '../../models/model.roleAssignment';
import ConfigMain from '../../configs/config.main';

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
        return await populateInputRestrictions(permissions, roleAssignment.Data);
      }
    }))).flat();

    validatePayloadAgainstRestrictions(roleAssignment, allRestrictions);
    return !(allRestrictions.length === 0);

  } catch (err) {
    return false;
  }
};