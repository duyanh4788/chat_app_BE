const { User } = require("../models/userModel");

let userLists = [];

const addUserList = ({ fullName, room, account, uid }) => {
  try {
    const checkEmail = User.findOne({ uid });
    if (checkEmail) {
      return;
    } else {
      const newUser = new User({
        userName,
        room,
        email,
        createAt: new Date(),
      });
      newUser.save();
      return (userLists = [...userLists, newUser]);
    }
  } catch (error) {
    console.log(error);
  }
};

const getUserList = (uid) => {
  const getUser = User.findOne({ uid });
};

const removeUserList = (id) =>
  (userLists = userLists.filter((item) => item.id !== id));

module.exports = {
  getUserList,
  removeUserList,
};
