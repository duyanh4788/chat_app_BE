import * as mongoose from 'mongoose';
import { AuthenticatorAppSchemaProps } from '../common/common.interface';

const Schema = mongoose.Schema;

export const AuthenticatorAppSchema = new Schema<AuthenticatorAppSchemaProps>(
  {
    userId: {
      type: String,
      required: true,
      unique: true
    },
    authKey: {
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
