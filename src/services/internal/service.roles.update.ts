import RoleModel from '../../models/model.role';
import IRole from '../../interfaces/interface.Role';

export default async (Title: string,Role: IRole): Promise<IRole> => {
  const role = await RoleModel.findOneAndUpdate({ Title },Role,{ new: true });
  return role? role.toObject():null;
};