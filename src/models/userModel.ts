import * as mongoose from 'mongoose';

interface UserSchemaProps {
  account: String;
  passWord: String;
  fullName: String;
  email: String;
  avatar: String;
  isOnline: Boolean;
  userTypeCode: String;
}

const Schema = mongoose.Schema;

export const UsersSchema = new Schema<UserSchemaProps>(
  {
    account: {
      type: String,
      required: true,
    },
    passWord: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      require: true,
      unique: true,
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
  },
  { timestamps: true, versionKey: false },
);