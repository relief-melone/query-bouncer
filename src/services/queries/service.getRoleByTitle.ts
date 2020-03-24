import RoleModel from '../../models/model.role';
import Role from '../../interfaces/interface.Role';
import errorFactory from '../error/service.errors';

export default async (Title: string, roleModel = RoleModel): Promise<Role> => {
  try {
    const role = await roleModel.findOne( { Title } );
    if(!role) throw errorFactory.documentNotFound('Role was not found');
    return role.toObject();
  } catch (err) {
    throw errorFactory.documentNotFound('Role was not found');
  }
};