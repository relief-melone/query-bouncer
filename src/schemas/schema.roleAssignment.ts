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

export default RoleAssignmentSchema;