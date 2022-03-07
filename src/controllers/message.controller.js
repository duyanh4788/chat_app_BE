const { Messages, MessagePrivate } = require("../models/messageModel");

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
    res.status(500).send({
      code: 500,
      message: error,
      success: false,
    });
  }
};

const getListMessage = async (req, res) => {
  try {
    const messageList = await MessagePrivate.find();
    !messageList &&
      res.status(400).send({
        code: 400,
        message: "DATA NOT FOUND!",
        success: false,
      });
    messageList &&
      res.status(200).send({
        data: messageList,
        code: 200,
        success: true,
      });
  } catch (error) {
    res.status(500).send({
      code: 500,
      message: error,
      success: false,
    });
  }
};

const getConverstationId = async (req, res) => {
  try {
    const converstationById = await MessagePrivate.findOne({ id: req.params.id });
    !converstationById &&
      res.status(400).send({
        data: null,
        message: "Converstation not found!",
        code: 400,
        success: true,
      });
    converstationById &&
      res.status(200).send({
        data: converstationById,
        message: null,
        code: 200,
        success: true,
      });
  } catch (error) {
    res.status(500).send({
      code: 500,
      message: error,
      success: false,
    });
  }
};

const postNewMessages = async (req, res) => {
  const newMessage = await MessagePrivate(req.body);
  try {
    const saveMessage = await newMessage.save();
    res.status(200).send({
      data: saveMessage,
      message: null,
      code: 200,
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      code: 500,
      message: error,
      success: false,
    });
  }
};

module.exports = {
  createMessageMG,
  getListMessage,
  postNewMessages,
  getConverstationId,
};
