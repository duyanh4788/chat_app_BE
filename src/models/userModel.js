const mongoose = require('mongoose');
const { TitleModel } = require('../common/common.constants');

const UserSchema = mongoose.Schema(
  {
    account: { type: String, require: true },
    passWord: { type: String, require: true },
    fullName: { type: String, require: true },
    email: { type: String, require: true },
    avatar: { type: String, default: '' },
    isOnline: { type: Boolean, default: false },
    userTypeCode: { type: String, default: 'USER' },
  },
  { timestamps: true },
);

const UserPrivateSchema = mongoose.Schema(
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
  { timestamps: true },
  { versionKey: false },
);

const User = mongoose.model(TitleModel.USER, UserSchema);

module.exports = {
  User,
};
