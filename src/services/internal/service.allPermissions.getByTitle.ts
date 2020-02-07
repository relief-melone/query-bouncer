import IPermission from '../../interfaces/interface.Permission';
import PermissionModel from '../../models/model.permission';
import InternalPermissionModel from '../../models/model.internalPermission';
export default async(title: string): Promise<IPermission>=>{
  const getpermissions = PermissionModel.findOne({ Title:title });
  const getInternalPermissions = InternalPermissionModel.findOne({ Title:title });
  const result = await Promise.all([getpermissions, getInternalPermissions]);
  const permissions = result.filter(x=>x)[0];
  return permissions? permissions.toObject():null;
};