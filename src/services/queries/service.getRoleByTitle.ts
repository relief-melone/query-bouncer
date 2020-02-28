import RoleModel from '../../models/model.role';
import Role from '../../interfaces/interface.Role';
import errorFactory from '../error/service.errors';
import logger from '../log/logger';

export default async (Title: string, roleModel = RoleModel): Promise<Role|null> => {
  logger.debug(`Service GetRoleByTitle - Getting Role by Title: ${Title}`, {
    title: Title,
    location : 'services/queries/service.getRoleByTitle'    
  });
  try {
    const role = await roleModel.findOne( { Title } );

    logger.debug('Service getRoleByTite. Returning Role', {
      role,
      location : 'services/queries/service.getRoleByTitle'    
    });

    if(role) return role.toObject();
    return null;
  } catch (err) {

    logger.info(`Service getRoleByTitle - Role not Found: ${Title}`, {
      title: Title,
      location : 'services/queries/service.getRoleByTitle'
    });

    throw errorFactory.documentNotFound('Role was not found');
  }
};