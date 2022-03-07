const mongoose = require("mongoose");
const { TitleModel } = require("../common/common.constants");

const UserSchema = mongoose.Schema({
  account: { type: String, require: true },
  passWord: { type: String, require: true },
  fullName: { type: String, require: true },
  email: { type: String, require: true },
  isOnline: { type: Boolean, default: false },
  userTypeCode: { type: String, default: "USER" },
  createAt: { type: Date, default: new Date() },
  avatar: { type: String, default: "" },
});

const UserPrivateSchema = mongoose.Schema(
  {
    account: {
      type: String,
      required: true,
    },
    password: {
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
      default: "",
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    userTypeCode: {
      type: String,
      default: "USER",
    },
  },
  { timestamps: true }
);

const User = mongoose.model(TitleModel.USER, UserSchema);
const UserPrivate = mongoose.model(TitleModel.USER_PRIVATE, UserPrivateSchema);

module.exports = {
  User,
  UserPrivate,
};
