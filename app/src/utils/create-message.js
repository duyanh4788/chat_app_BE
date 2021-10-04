const timeFormat = require('date-format');

let messageList = []

const createMessage = ({ message, userId, userRoom }) => {
    if (message && message !== null) {
        return {
            message,
            userId,
            userRoom,
            createAt: timeFormat("dd-MM-yyyy hh:mm:ss", new Date()),
        }
    }
}

const renderMessage = ({ message, userId, userRoom }) => {
    if (message || message !== null) {
        return messageList = [...messageList, createMessage({ message, userId, userRoom })]
    }
}

module.exports = {
    createMessage,
    renderMessage
}