const timeFormat = require("date-format");

let messageList = [];

const createMessage = ({ message, account, fullName, uid }) => {
  if (message && message !== null) {
    const data = {
      uid,
      message,
      account,
      fullName,
      createAt: timeFormat("dd-MM-yyyy hh:mm:ss", new Date()),
    };
    return data;
  }
};
const renderMessage = ({ message, account, fullName, uid }) => {
  messageList = [
    ...messageList,
    createMessage({ message, account, fullName, uid }),
  ];
  return messageList;
};

module.exports = {
  createMessage,
  renderMessage,
};
