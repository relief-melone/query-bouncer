import IPermission from '../../interfaces/interface.Permission';
import { Model, Document } from 'mongoose';

export default (permissionModel: Model<Document,{}>) => async (Title: string): Promise<IPermission> =>{
  const permission = await permissionModel.findOneAndDelete({ Title });
  return permission? permission.toObject():null;
};