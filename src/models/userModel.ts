import * as mongoose from 'mongoose';

export enum UserTypeCreate {
  FACEBOOK = 'FACEBOOK',
  GOOGLE = 'GOOGLE',
  CHATAPP = 'CHATAPP',
}

export interface UserSchemaProps {
  _id?: String;
  account?: String;
  passWord?: String;
  fullName?: String;
  email?: String;
  avatar?: String;
  isOnline?: Boolean;
  userTypeCode?: String;
  userTypeCreate?: UserTypeCreate;
  userTypeCreateId?: String;
}

const Schema = mongoose.Schema;

export const UsersSchema = new Schema<UserSchemaProps>(
  {
    account: {
      type: String,
      required: true,
      unique: true,
    },
    passWord: {
      type: String,
    },
    fullName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    avatar: {
      type: String,
      default: '',
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    userTypeCode: {
      type: String,
      default: 'USER',
    },
    userTypeCreate: {
      type: Schema.Types.Mixed,
      default: '',
    },
    userTypeCreateId: {
      type: String,
      default: '',
    },
  },
  { timestamps: true, versionKey: false },
);