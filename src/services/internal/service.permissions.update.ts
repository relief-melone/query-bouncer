import IPermission from '../../interfaces/interface.Permission';
import { Model, Document } from 'mongoose';

export default (permissionModel: Model<Document,{}>) => async (Title: string,Permission: IPermission): Promise<IPermission> =>{
  const permission = await permissionModel.findOneAndUpdate({ Title },Permission,{ new:true });
  return permission? permission.toObject():{};
};