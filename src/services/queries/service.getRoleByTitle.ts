import RoleModel from '../../models/model.role';
import Role from '../../interfaces/interface.Role';
import errorFactory from '../error/service.errors';

export default async (Title: string, roleModel = RoleModel): Promise<Role|null> => {
  try {
    const role = await roleModel.findOne( { Title } );
    if(role) return role.toObject();
    return null;
  } catch (err) {
    throw errorFactory.documentNotFound('Role was not found');
  }
};