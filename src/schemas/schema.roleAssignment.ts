import { Schema } from 'mongoose';

const RoleAssignmentSchema = new Schema({
  User: {
    type: String,
    required:true 
  },
  Role: {
    type: String,
    required: true
  },
  Data: {
    type: Schema.Types.Mixed,
    default: {}
  }
}, {
  minimize: false
});
RoleAssignmentSchema.index({ User:1, Role:1, Data:1 }, { unique:true });
export default RoleAssignmentSchema;