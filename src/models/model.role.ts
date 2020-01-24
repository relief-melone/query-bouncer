import mongoose from '../services/mongodb/service.mongodbConnector';
import RoleSchema from '../schemas/schema.role';

const RoleModel = mongoose.model('role', RoleSchema);
RoleModel.createIndexes();

export default RoleModel;