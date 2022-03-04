const { Messages } = require("../models/messageModel");

const createMessageMG = async ({ message, account, fullName, uid }) => {
  try {
    const data = {
      uid,
      message,
      account,
      fullName,
      createAt: new Date(),
    };
    await Messages.create(data);
  } catch (error) {
    console.log(error);
  }
};

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

module.exports = {
  createMessageMG,
  getListMessage,
};
