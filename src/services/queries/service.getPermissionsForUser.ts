import RoleAssignmentModel from '../../models/model.roleAssignment';
import specialUsers from '../../interfaces/enum.specialUsers';
import { Model, Document } from 'mongoose';
import RoleModel from '../../models/model.role';
import Permission from '../../interfaces/interface.Permission';
import populateRestriction from '../service.populateRestriction';

export default ( permissionModel: Model<Document,{}>,roleAssignmentModel=RoleAssignmentModel, roleModel = RoleModel)=> async (user: string | null): Promise<Permission[]> => {
  const users = user?
    [ user, specialUsers.anyone,specialUsers.authenticated ]
    : [specialUsers.anyone];
  const queryResult = await roleAssignmentModel.aggregate([
    {
      '$match': {
        User:{ $in:users }
      }
    }, {
      '$lookup': {
        'from': roleModel.collection.name, 
        'localField': 'Role', 
        'foreignField': 'Title', 
        'as': 'Role'
      }
    }, {
      '$project': {
        'Permissions': {
          '$arrayElemAt': [
            '$Role.Permissions', 0
          ]
        }, 
        'Data': '$Data'
      }
    }, {
      '$lookup': {
        'from': permissionModel.collection.name, 
        'localField': 'Permissions', 
        'foreignField': 'Title', 
        'as': 'Permissions'
      }
    }
  ]).exec(); 
  const permissionsWithData = queryResult as DataWithPermissions[];
  const populatedPermissions = permissionsWithData.
    flatMap(pwD=>pwD.Permissions.map(permission=>{
      permission.QueryRestriction = populateRestriction(permission.QueryRestriction, pwD.Data);
      permission.PayloadRestriction = populateRestriction(permission.PayloadRestriction, pwD.Data);
      return permission;
    }));
  return populatedPermissions;
};


interface DataWithPermissions{
  Permissions: Permission[];
  Data: object;

} 