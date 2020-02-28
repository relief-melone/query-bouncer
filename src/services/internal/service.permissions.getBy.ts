import Permission, { Right } from '../../interfaces/interface.Permission';
import { Model, Document } from 'mongoose';
import logger from '../log/logger';

export default (permissionModel: Model<Document,{}> )=> async (operationType: Right, collection: string, Titles: string[]): Promise<Array<Permission>> => {
  const query = {
    Right: Right[operationType],
    Collection: collection,
    Title: { $in: Titles }
  };

  logger.debug('Service Permissions GetBy - Getting Permission', {
    operationType,
    collection,
    titles: Titles,
    location: '/services/internal/service.permissions.getBy',
    query
  });

  const permissions = await permissionModel.find(query);

  const permissionObjects = permissions.map(pm => pm.toObject());

  logger.debug('Service Perissions GetBy - Returing Permissions', {
    permissions
  });

  return permissionObjects;
};