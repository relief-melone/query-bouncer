import RoleAssignmentModel from '../../models/model.roleAssignment';
import RoleAssignment  from '../../interfaces/interface.RoleAssignment';
import specialUsers from '../../interfaces/enum.specialUsers';

export default async (user: string | null, roleAssignmentModel=RoleAssignmentModel): Promise<Array<RoleAssignment>> => {
  try {
    const users = user?
      [ user, specialUsers.anyone,specialUsers.authenticated ]
      : [specialUsers.anyone];
    const roleAssignments =  await roleAssignmentModel.find( {
      User:{ $in:users }
    });
    return roleAssignments.map(ra => ra.toObject()) as RoleAssignment[];
  } catch (err) {
    throw err;
  }
};
