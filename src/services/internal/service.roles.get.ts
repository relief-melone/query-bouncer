import RoleModel from '../../models/model.role';
import IRole from '../../interfaces/interface.Role';

export default async (): Promise<IRole[]> => {
  const roles = await RoleModel.find();
  return roles.map(r=>r.toObject());
};