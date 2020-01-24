import mongoose from '../services/mongodb/service.mongodbConnector';
import PermissionSchema from '../schemas/schema.permission';

const InternalPermissionModel = mongoose.model('internal_permission', PermissionSchema);

InternalPermissionModel.createIndexes();

export default InternalPermissionModel;