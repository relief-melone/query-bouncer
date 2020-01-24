import { Schema } from 'mongoose';

export default interface Permission {
  _id?: string | Schema.Types.ObjectId;
  Title: string;
  Collection: string;
  Right: Right;
  ExcludedPaths: Array<string>;
  QueryRestriction: Record<string, any>;
  PayloadRestriction: Record<string,any>;
}

export enum Right {
  'read', 'update', 'create', 'delete'
}