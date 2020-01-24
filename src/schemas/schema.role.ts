import { Schema } from 'mongoose';
import PermissionsValidator from '../services/validation/service.validate.role.permission';

const RoleSchema = new Schema({
  Title: {
    type: String,
    unique: true,
    required: true
  },
  Permissions: {
    type: [ String ],
    required:true,
    validate: {
      validator(data: any): boolean{
        return PermissionsValidator(data);
      }
    }
  }
});

export default RoleSchema;