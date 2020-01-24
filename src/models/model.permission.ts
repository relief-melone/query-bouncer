import mongoose from '../services/mongodb/service.mongodbConnector';
import PermissionSchema from '../schemas/schema.permission';

const PermissionModel = mongoose.model('permission', PermissionSchema);

PermissionModel.createIndexes();

export default PermissionModel;