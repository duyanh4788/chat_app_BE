const { User } = require("../models/userModel");

let userLists = [];
const addUserList = async (uid) => {
  try {
    const checkUid = User.findOne({ uid });
    if (checkUid) {
      return;
    } else {
      const newUser = new User({
        fullName,
        room,
        account,
        uid,
        createAt: new Date(),
      });
      newUser.save();
      userLists = [...userLists, newUser];
      return userLists;
    }
  } catch (error) {
    console.log(error);
  }
};
const getUserList = async ({ room, fullName, account }) => {
  try {
    const checkAccount = await User.findOne({ account });
    if (!checkAccount) return;
    userLists.push(checkAccount);
    return userLists;
  } catch (error) {
    console.log(error);
  }
};

const removeUserList = (id) =>
  (userLists = userLists.filter((item) => item.id !== id));

module.exports = {
  getUserList,
  addUserList,
  removeUserList,
};
