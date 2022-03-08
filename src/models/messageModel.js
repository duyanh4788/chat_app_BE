const mongoose = require("mongoose");
const { TitleModel } = require("../common/common.constants");

const MessageSchema = mongoose.Schema({
  uid: { type: String, require: true },
  message: { type: String, require: true },
  account: { type: String, require: true },
  fullName: { type: String, require: true },
  createAt: { type: Date, require: true },
});

const MessagePrivateSchema = mongoose.Schema(
  {
    senderId: {
      type: String,
      require: true,
    },
    senderName: {
      type: String,
      require: true,
    },
    reciverId: {
      type: String,
      require: true,
    },
    reciverName: {
      type: String,
      require: true,
    },
    text: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

const Messages = mongoose.model(TitleModel.MESSAGE, MessageSchema);
const MessagePrivate = mongoose.model(
  TitleModel.MESSAGE_PRIVATE,
  MessagePrivateSchema
);

module.exports = {
  Messages,
  MessagePrivate,
};
