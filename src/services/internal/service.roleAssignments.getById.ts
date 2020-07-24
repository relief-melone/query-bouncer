import RoleAssignmentModel from '../../models/model.roleAssignment';
import IRoleAssignment from '../../interfaces/interface.RoleAssignment';

export default async (id: string): Promise<IRoleAssignment|null> => {
  const roleAssignment = await RoleAssignmentModel.findOne({ _id:id });
  return roleAssignment != null
    ? roleAssignment.toObject()
    : null;
};