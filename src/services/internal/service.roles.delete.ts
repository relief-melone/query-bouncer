import RoleModel from '../../models/model.role';
import IRole from '../../interfaces/interface.Role';

export default async (Title: string): Promise<IRole> =>{
  const role = await RoleModel.findOneAndDelete({ Title });
  return role? role.toObject():{};
};