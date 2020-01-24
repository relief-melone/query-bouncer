import IPermission from '../../interfaces/interface.Permission';
import { Model, Document } from 'mongoose';

export default (permissionModel: Model<Document,{}>) => async (): Promise<IPermission[]> =>{
  const permissions = await permissionModel.find();
  return permissions.map(p=>p.toObject());
};