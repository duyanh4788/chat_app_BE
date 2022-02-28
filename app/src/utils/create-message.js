const timeFormat = require("date-format");

let messageList = [];

const createMessage = ({ message, account, fullName, uid }) => {
  if (message && message !== null) {
    return {
      message,
      account,
      fullName,
      uid,
      createAt: timeFormat("dd-MM-yyyy hh:mm:ss", new Date()),
    };
  }
};

const renderMessage = ({ message, account, fullName, uid }) => {
  if (message && message !== null) {
    messageList = [
      ...messageList,
      createMessage({ message, account, fullName, uid }),
    ];
    return messageList;
  }
};

module.exports = {
  createMessage,
  renderMessage,
};
