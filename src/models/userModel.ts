import * as mongoose from 'mongoose';
import { UserSchemaProps } from '../common/common.interface';

const Schema = mongoose.Schema;

export const UsersSchema = new Schema<UserSchemaProps>(
  {
    account: {
      type: String,
      required: true,
      unique: true
    },
    passWord: {
      type: String
    },
    fullName: {
      type: String
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    avatar: {
      type: String,
      default: ''
    },
    isOnline: {
      type: Boolean,
      default: false
    },
    userTypeCode: {
      type: String,
      default: 'USER'
    },
    userTypeCreate: {
      type: Schema.Types.Mixed
    },
    userTypeCreateId: {
      type: String,
      default: ''
    },
    statusCreate: {
      type: Schema.Types.Mixed
    },
    twofa: {
      type: Boolean,
      default: false
    },
    type2FA: {
      type: Schema.Types.Mixed,
      default: ''
    }
  },
  { timestamps: true, versionKey: false }
);
