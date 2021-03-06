import mongoose from '../services/mongodb/service.mongodbConnector';
import RoleAssignmentSchema from '../schemas/schema.roleAssignment';

const RoleAssignmentModel = mongoose.model('roleAssignment', RoleAssignmentSchema);
RoleAssignmentModel.createIndexes();
RoleAssignmentModel.ensureIndexes();

export default RoleAssignmentModel;