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

const ListMessagesSchema = mongoose.Schema({
  listMessage: [MessageSchema],
});

const ListMessages = mongoose.model(
  TitleModel.LIST_MESSAGES,
  ListMessagesSchema
);
const Messages = mongoose.model(TitleModel.MESSAGE, MessageSchema);

module.exports = {
  ListMessages,
  Messages,
};
