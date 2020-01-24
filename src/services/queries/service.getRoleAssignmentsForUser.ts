import RoleAssignmentModel from '../../models/model.roleAssignment';
import RoleAssignment  from '../../interfaces/interface.RoleAssignment';
import specialUsers from '../../interfaces/enum.specialUsers';

export default async (user: string | null, roleAssignmentModel=RoleAssignmentModel): Promise<Array<RoleAssignment>> => {
  try {
    const roleAssignments = user ? await Promise.all([
      ...(await roleAssignmentModel.find({ User: specialUsers.anyone })),
      ...(await roleAssignmentModel.find({ User: specialUsers.authenticated })),
      ...(await roleAssignmentModel.find({ User: user })),      
    ]) : await roleAssignmentModel.find({ User : specialUsers.anyone });
    
    return roleAssignments.map(ra => ra.toObject()) as RoleAssignment[];
  } catch (err) {
    throw err;
  }
};
