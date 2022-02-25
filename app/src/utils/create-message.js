const timeFormat = require("date-format");

let messageList = [];

const createMessage = ({ message, email, userName }) => {
  if (message && message !== null) {
    return {
      message,
      email,
      userName,
      createAt: timeFormat("dd-MM-yyyy hh:mm:ss", new Date()),
    };
  }
};

const renderMessage = ({ message, email, userName }) => {
  if (message && message !== null) {
    messageList = [...messageList, createMessage({ message, email, userName })];
    return messageList;
  }
};

module.exports = {
  createMessage,
  renderMessage,
};
