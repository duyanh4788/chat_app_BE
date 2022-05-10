const mongoose = require('mongoose');
const { TitleModel } = require('../common/common.constants');

const MessageSchema = mongoose.Schema({
  uid: { type: String, require: true },
  message: { type: String, require: true },
  account: { type: String, require: true },
  fullName: { type: String, require: true },
  createAt: { type: Date, require: true },
});

const MessagePrivateSchema = mongoose.Schema(
  {
    conversationId: {
      type: String,
    },
    senderId: {
      type: String,
      require: true,
    },
    reciverId: {
      type: String,
      require: true,
    },
    text: {
      type: String,
      require: true,
    },
  },
  { timestamps: true },
  { versionKey: false },
);

const MessagePrivate = mongoose.model(
  TitleModel.MESSAGE_PRIVATE,
  MessagePrivateSchema,
);
const Messages = mongoose.model(TitleModel.MESSAGE, MessageSchema);

module.exports = {
  MessagePrivate,
  Messages,
};
