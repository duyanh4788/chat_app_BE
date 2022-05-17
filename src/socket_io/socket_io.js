const Filter = require('bad-words');
const {
  renderMessages,
  changeStatusOnline,
  changeStatusOffline,
} = require('../utils/createMessages');
const {
  createUser,
  getUserById,
  removeUserList,
} = require('../utils/createUsers');
const { SOCKET_COMMIT, TEXT_BAD } = require('../common/common.constants');

module.exports = socket_io => {
  socket_io.on(SOCKET_COMMIT.CONNECT, socket => {
    /** Connect **/
    socket.on(SOCKET_COMMIT.JOIN_ROOM, infoUser => {
      const listUser = createUser(socket, infoUser);
      if (listUser && listUser.length) {
        const isUser = listUser.find(({ _id }) => _id === infoUser._id);
        /** send notify **/
        socket.emit(
          SOCKET_COMMIT.SEND_MESSAGE_NOTIFY,
          `Hello ${isUser.fullName}`,
        );
        socket.broadcast.emit(
          SOCKET_COMMIT.CHANGE_STATUS_ONLINE,
          changeStatusOnline(isUser),
        );
        socket.broadcast.emit(
          SOCKET_COMMIT.SEND_MESSAGE_NOTIFY,
          `${isUser.fullName} Online`,
        );
      }
    });
    /** send messages **/
    socket.on(
      SOCKET_COMMIT.SEND_MESSAGE,
      (infoUser, dataMessages, callBackAcknow) => {
        const userBySocketId = getUserById(infoUser._id);
        if (userBySocketId) {
          const filter = new Filter();
          filter.addWords(...TEXT_BAD);
          if (filter.isProfane(dataMessages.text)) {
            return callBackAcknow(SOCKET_COMMIT.MESSAGE_NOT_AVALID);
          }
          socket_io.emit(
            SOCKET_COMMIT.SEND_LIST_MESSAGE,
            renderMessages(dataMessages),
          );
          socket.broadcast.emit(
            SOCKET_COMMIT.SEND_MESSAGE_SENDER,
            `${userBySocketId.fullName} nhắn tin`,
          );
          callBackAcknow();
        }
      },
    );
    /** disconnect **/
    socket.on(SOCKET_COMMIT.DISCONNECTED, infoUser => {
      const userBySocketId = getUserById(infoUser._id);
      if (userBySocketId) {
        socket.broadcast.emit(
          SOCKET_COMMIT.CHANGE_STATUS_OFFLINE,
          changeStatusOffline(userBySocketId),
        );
        socket.broadcast.emit(
          SOCKET_COMMIT.SEND_MESSAGE_NOTIFY,
          `${userBySocketId.fullName} offline`,
        );
      }
      removeUserList(infoUser._id);
    });
  });
};
