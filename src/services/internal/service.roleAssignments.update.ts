import RoleAssignmentModel from '../../models/model.roleAssignment';
import IRoleAssignment from '../../interfaces/interface.RoleAssignment';

export default async ( id: string, roleAssignment: IRoleAssignment ): Promise<IRoleAssignment> => {
  const updatedRoleAssignment = await RoleAssignmentModel.findOneAndUpdate({ _id:id },roleAssignment, { new:true });
  return updatedRoleAssignment? updatedRoleAssignment.toObject(): null;
};