import RoleAssignmentModel from '../../models/model.roleAssignment';
import IRoleAssignment from '../../interfaces/interface.RoleAssignment';

export default async ( id: string ): Promise<IRoleAssignment> => {
  const deletedRoleAssignment = await RoleAssignmentModel.findOneAndDelete({ _id:id });
  return deletedRoleAssignment? deletedRoleAssignment.toObject(): null;
};