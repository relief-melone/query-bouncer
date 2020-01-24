import RoleAssignmentModel from '../../models/model.roleAssignment';
import IRoleAssignment from '../../interfaces/interface.RoleAssignment';

export default async (Role: IRoleAssignment): Promise<IRoleAssignment> => {
  const roleAssignment = await RoleAssignmentModel.create(Role);
  return roleAssignment.toObject();
};