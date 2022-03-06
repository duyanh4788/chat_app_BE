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

const User = mongoose.model(TitleModel.USER, UserSchema);

module.exports = {
  User,
};
