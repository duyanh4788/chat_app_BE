const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema({
  /* Model */
  uid: { type: String, require: true },
  message: { type: String, require: true },
  account: { type: String, require: true },
  fullName: { type: String, require: true },
  createAt: Date,
});

const ListMessagesSchema = mongoose.Schema({
  listMessage: [MessageSchema],
});

const ListMessages = mongoose.model("ListMessages", ListMessagesSchema);
const Messages = mongoose.model("Messages", MessageSchema);

module.exports = {
  ListMessages,
  Messages,
};
