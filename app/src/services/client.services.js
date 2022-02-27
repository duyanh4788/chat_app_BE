const { User } = require("../models/userModel");

const createUserService = async (data) => {
  const newUser = await User.create(data);
  if (newUser) return newUser;
  if (!newUser) return false;
};

module.exports = [createUserService];
