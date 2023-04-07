import * as mongoose from 'mongoose';

export interface AuthenticatorAppSchemaProps {
  userId: String;
  authKey: String;
  dateTimeCreate: Date;
}

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
