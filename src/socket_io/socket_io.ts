import { Server } from 'http';
import Filter from 'bad-words';
import { SOCKET_COMMIT, TEXT_BAD } from '../common/common.constants';
import {
  changeStatusOffline,
  changeStatusOnline,
  renderMessages,
} from '../utils/createMessages';
import { createUser, getUserById, removeUserList } from '../utils/createUsers';

export class Websocket {
  public socketIO(socket_io: Server) {
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
  }
}
