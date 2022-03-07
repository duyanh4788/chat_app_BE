const mongoose = require("mongoose");
const { TitleModel } = require("../common/common.constants");

const MessageSchema = mongoose.Schema({
  /* Model */
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
    sender: {
      type: String,
    },
    text: {
      type: String,
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
