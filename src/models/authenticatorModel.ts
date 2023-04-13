import * as mongoose from 'mongoose';
import { AuthenticatorSchemaProps } from '../common/common.interface';

const Schema = mongoose.Schema;

export const AuthenticatorSchema = new Schema<AuthenticatorSchemaProps>(
  {
    userId: {
      type: String,
      required: true,
      unique: true
    },
    authCode: {
      type: String,
      required: true
    },
    dateTimeCreate: {
      type: Date,
      required: true
    }
  },
  { timestamps: true, versionKey: false }
);
