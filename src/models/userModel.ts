import * as mongoose from 'mongoose';

export enum UserTypeCreate {
  FACEBOOK = 'FACEBOOK',
  GOOGLE = 'GOOGLE',
  CHATAPP = 'CHATAPP',
}

export enum StatusCreate {
  IN_ACTIVE = 'IN_ACTIVE',
  ACTIVE = 'ACTIVE',
}

export enum Type2FA {
  AUTH_CODE = 'AUTH_CODE',
  PASSPORT = 'PASSPORT',
}

export interface UserSchemaProps {
  _id?: String;
  account?: String;
  passWord?: String;
  fullName?: String;
  email?: String;
  avatar?: String;
  isOnline?: Boolean;
  statusCreate?: Type2FA;
  twoFA?: boolean;
  type2FA?: Type2FA;
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
    statusCreate: {
      type: Schema.Types.Mixed,
      default: '',
    },
    twoFA: {
      type: Boolean,
      default: false,
    },
    type2FA: {
      type: Schema.Types.Mixed,
      default: '',
    },
  },
  { timestamps: true, versionKey: false },
);