import Permission, { Right } from '../../interfaces/interface.Permission';
import { Model, Document } from 'mongoose';

export default (permissionModel: Model<Document,{}> )=> async (operationType: Right, collection: string, Titles: string[]): Promise<Array<Permission>> => {
  const query = {
    Right: Right[operationType],
    Collection: collection,
    Title: { $in: Titles }
  };

  const permissions = await permissionModel.find(query);
  return permissions.map(pm => pm.toObject());
};