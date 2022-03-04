const { ListMessages, Messages } = require("../models/messageModel");
const timeFormat = require("date-format");

const createDBMessage = async ({ message, account, fullName, uid }) => {
  try {
    const data = {
      uid,
      message,
      account,
      fullName,
    };
    const newMessage = await Messages.create(data);
    // if (newMessage) {
    //   await ListMessages.create(newMessage);
    // }
    console.log(newMessage);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createDBMessage,
};
