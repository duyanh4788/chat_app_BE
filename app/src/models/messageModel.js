const mongoose = require("mongoose");
const { User } = require("./userModel");

const MessageSchema = mongoose.Schema({
  listMessage: [
    {
      userId: User.id,
      message: { type: String, require: true },
      createAt: new Date.now(),
    },
  ],
});

const Message = mongoose.model("Message", MessageSchema);

module.exports = {
  Message,
};
