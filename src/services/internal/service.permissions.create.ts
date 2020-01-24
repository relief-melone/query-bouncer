import IPermission from '../../interfaces/interface.Permission';
import { Document, Model } from 'mongoose';

export default (permissionsModel: Model<Document,{}> )=> async (Permission: IPermission): Promise<IPermission> => {
  const permission = await permissionsModel.create(Permission);
  return permission.toObject();
};
