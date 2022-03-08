const { MessagePrivate } = require("../models/messageModel");

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

const postConvertStationMyFriend = async (req, res) => {
  try {
    const converStationMyFriend = await MessagePrivate.find({
      reciverId: req.body.reciverId,
      senderId: req.body.senderId,
    });
    if (!converStationMyFriend) {
      return res.status(400).send({
        data: null,
        message: "Converstation not found!",
        code: 400,
        success: true,
      });
    }
    if (converStationMyFriend) {
      res.status(200).send({
        data: converStationMyFriend,
        message: null,
        code: 200,
        success: true,
      });
    }
  } catch (error) {
    res.status(500).send({
      code: 500,
      message: error,
      success: false,
    });
  }
};

module.exports = {
  postNewMessages,
  postConvertStationMyFriend,
};
