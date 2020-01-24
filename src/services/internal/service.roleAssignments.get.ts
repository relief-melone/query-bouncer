import RoleAssignmentModel from '../../models/model.roleAssignment';
import IRoleAssignment from '../../interfaces/interface.RoleAssignment';

export default async (): Promise<IRoleAssignment[]> => {
  const roleAssignments = await RoleAssignmentModel.find();
  return roleAssignments.map(ra=>ra.toObject());
};