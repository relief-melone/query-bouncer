import RoleAssignmentModel from '../../models/model.roleAssignment';
import specialUsers from '../../interfaces/enum.specialUsers';
import { Model, Document } from 'mongoose';
import RoleModel from '../../models/model.role';
import Permission from '../../interfaces/interface.Permission';
import populatePermission from '../service.populateRestriction';

export default ( permissionModel: Model<Document,{}>,roleAssignmentModel=RoleAssignmentModel, roleModel = RoleModel)=> async (user: string | null): Promise<Permission[]> => {
  try {
    const users = user?
      [{ User: 'q464670' }, 
        { User: specialUsers.anyone },
        { User:specialUsers.authenticated } ]
      : [{ User:specialUsers.anyone }];
    const queryResult = await roleAssignmentModel.aggregate([
      {
        '$match': {
          '$or': users
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
    const permissionsWithData = queryResult as DataWithRoleAssignment[];
    const populatedPermissions = permissionsWithData.flatMap(pwD=>pwD.Permissions.map(permission=>{
      permission.QueryRestriction = populatePermission(permission.QueryRestriction, pwD.Data);
      permission.PayloadRestriction = populatePermission(permission.PayloadRestriction, pwD.Data);
      return permission;
    }));
    return populatedPermissions;
  } catch (err) {
    throw err;
  } ;
};


interface DataWithRoleAssignment{
  Permissions: Permission[];
  Data: object;

} 