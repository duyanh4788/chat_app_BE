const { MessagePrivate } = require('../models/messageModel');

const postNewMessages = async (req, res) => {
  const newMessage = await MessagePrivate(req.body);
  try {
    const saveMessage = await newMessage.save();
    res.status(200).send({
      data: saveMessage,
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

const getListMessages = async (req, res) => {
  try {
    const listMessages = await MessagePrivate.find(
      {
        conversationId: req.body.conversationId,
      },
      '-_id',
    ).select(['conversationId', 'senderId', 'text', 'createdAt']);
    if (!listMessages) {
      return res.status(400).send({
        data: null,
        message: 'List Messages Not Found!',
        code: 400,
        success: true,
      });
    }
    if (listMessages) {
      res.status(200).send({
        data: listMessages,
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
  getListMessages,
};
