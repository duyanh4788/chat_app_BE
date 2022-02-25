const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  account: { type: String, require: true },
  passWord: { type: String, require: true },
  fullName: { type: String, require: true },
  email: { type: String, require: true },
  userTypeCode: String,
  createAt: Date,
  avatar: String,
});

const User = mongoose.model("User", UserSchema);

module.exports = {
  User,
};
