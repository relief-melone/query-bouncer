// const SchemaVersion = '1.0.0';

import mongoose from '../services/mongodb/service.mongodbConnector';
import { Schema } from 'mongoose';

const PermissionSchema: Schema = new mongoose.Schema({
  Title: {
    type: String,
    unique: true,
    required: true
  },
  Collection: {
    type: String,
    required: true
  },
  Right: {
    type: String,
    enum: ['read', 'update', 'create', 'delete'],
    required: true
  },
  ExcludedPaths: {
    type: [String],
    default : []
  },
  QueryRestriction: {
    type: Schema.Types.Mixed,
    default: {}
  },
  PayloadRestriction : {
    type: Schema.Types.Mixed,
    default: {}
  }
}, {
  minimize: false
});

export default PermissionSchema;