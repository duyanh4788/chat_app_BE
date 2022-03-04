const mongoose = require("mongoose");
const { TitleModel } = require("../common/common.constants");

const UserSchema = mongoose.Schema({
  account: { type: String, require: true },
  passWord: { type: String, require: true },
  fullName: { type: String, require: true },
  email: { type: String, require: true },
  userTypeCode: String,
  createAt: Date,
  avatar: String,
});

const User = mongoose.model(TitleModel.USER, UserSchema);

module.exports = {
  User,
};
