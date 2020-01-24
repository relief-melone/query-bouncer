import { Schema } from 'mongoose';

export default interface RoleAssignment {
  _id?: string | Schema.Types.ObjectId;
  User: string;
  Role: string;
  Data: Record<string,any>;
}