const Filter = require("bad-words");
import { SOCKET_COMMIT, TEXT_BAD } from "../common/common.constants";
import { createMessageMG } from "../controllers/message.controller";
import {
  createMessageSocket,
  renderMessageSocket,
} from "../utils/createMessageSocket";
import { addUserList, getUserList, removeUserList } from "../utils/createUsers";

export function SocketIo(socket_io) {
  return socket_io.on(SOCKET_COMMIT.CONNECT, (socket) => {
    /**reciver join room */
    socket.on(SOCKET_COMMIT.JOIN_ROOM, ({ fullName, room, account, uid }) => {
      socket.join(room);
      /** add client join room */
      socket_io
        .to(room)
        .emit(SOCKET_COMMIT.ADD_CLIENT_JOIN_ROOM, addUserList(uid));
      /** notify */
      socket.emit(SOCKET_COMMIT.SEND_MESSAGE_NOTIFY, `Hello ${fullName}`);
      /** send message to new client after join */
      socket.broadcast
        .to(room)
        .emit(SOCKET_COMMIT.SEND_MESSAGE_NOTIFY, `${fullName} Joining`);
      /** render client inside room */
      socket_io
        .to(room)
        .emit(
          SOCKET_COMMIT.SEND_LIST_CLIENT,
          getUserList({ room, fullName, account })
        );
      /** chat */
      socket.on(SOCKET_COMMIT.SEND_MESSAGE, (message, callBackAcknow) => {
        createMessageMG({ message, account, fullName, uid });
        const filter = new Filter();
        filter.addWords(...TEXT_BAD);
        // const sendSuccess = 200;
        if (filter.isProfane(message)) {
          let returnText = filter.clean(message);
          socket_io
            .to(room)
            .emit(SOCKET_COMMIT.SEND_MESSAGE, renderMessageSocket(returnText));
          return callBackAcknow(SOCKET_COMMIT.MESSAGE_NOT_AVALID);
        }
        // save database
        socket_io
          .to(room)
          .emit(
            SOCKET_COMMIT.SEND_MESSAGE,
            createMessageSocket({ message, account, fullName, uid })
          );
        socket_io
          .to(room)
          .emit(
            SOCKET_COMMIT.SEND_ARRAY_MESSAGE,
            renderMessageSocket({ message, account, fullName, uid })
          );
        callBackAcknow();
      });
      /** location */
      socket.on(SOCKET_COMMIT.SEND_LOCATION, (location) => {
        if (location) {
          const linkLocation = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
          socket_io
            .to(room)
            .emit(SOCKET_COMMIT.SERVER_SEND_LOCATION, linkLocation);
          socket_io.to(room).emit(
            SOCKET_COMMIT.SEND_ARRAY_MESSAGE,
            renderMessageSocket({
              message: linkLocation,
              account,
              fullName,
              uid,
            })
          );
        }
      });

      /**disconnect socket io */
      socket.on(SOCKET_COMMIT.DISCONNECT, () => {
        removeUserList(socket.id);
        /** render client inside room */
        socket_io
          .to(room)
          .emit(
            SOCKET_COMMIT.SEND_LIST_CLIENT,
            getUserList({ room, fullName, account })
          );
      });
    });
  });
}
