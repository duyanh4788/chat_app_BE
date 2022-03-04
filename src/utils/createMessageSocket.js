const { Messages } = require("../models/messageModel");
let messageList = [];

const getListMessage = async (req, res) => {
  try {
    const messageList = await Messages.find();
    if (messageList) {
      res.status(200).send({
        data: messageList,
        code: 200,
        success: true,
      });
    } else {
      res.status(400).send({
        code: 400,
        message: "DATA ERROR",
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const createMessageSocket = ({ message, account, fullName, uid }) => {
  if (message && message !== null) {
    const data = {
      uid,
      message,
      account,
      fullName,
      createAt: new Date(),
    };
    return data;
  }
};
const renderMessageSocket = ({ message, account, fullName, uid }) => {
  messageList = [
    ...messageList,
    createMessageSocket({ message, account, fullName, uid }),
  ];
  return messageList;
};

module.exports = {
  createMessageSocket,
  renderMessageSocket,
};
