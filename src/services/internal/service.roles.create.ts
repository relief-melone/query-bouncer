import RoleModel from '../../models/model.role';
import IRole from '../../interfaces/interface.Role';

export default async (Role: IRole): Promise<IRole> => {
  const role = await RoleModel.create(Role);
  return role.toObject();
};