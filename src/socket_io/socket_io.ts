import Filter from 'bad-words';
import { Server, Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { SOCKET_COMMIT, TEXT_BAD } from '../common/common.constants';
import { MessagesDriversController } from '../MongoDriversController/MessagesDriversController';
import { UserDriversController } from '../MongoDriversController/UserDriversController';

import { changeStatusIsNewMsg, changeStatusLogin, renderMessages } from '../utils/createMessages';
import { createUser, getUserById, removeUserList } from '../utils/createUsers';
interface InfoUser {
  socketId: string;
  _id: string;
  account: string;
  fullName: string;
  email: string;
  avatar: string;
  isOnline: boolean;
}

interface DataMessages {
  conversationId: string;
  senderId: string;
  reciverId: string;
  text: string;
}

export class Websocket {
  private messagesDriversController: MessagesDriversController = new MessagesDriversController();
  private userDriversController: UserDriversController = new UserDriversController();

  constructor() {
    this.messagesDriversController.createNewMessages =
      this.messagesDriversController?.createNewMessages.bind(this);
    this.userDriversController.updateStatus = this.userDriversController.updateStatus.bind(this);
  }

  public socketIO(socket_io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>) {
    socket_io.on(SOCKET_COMMIT.CONNECT, (socket: Socket) => {
      /** Connect **/
      socket.on(SOCKET_COMMIT.JOIN_ROOM, (infoUser: InfoUser) => {
        const listUser = createUser(socket, infoUser);
        if (listUser && listUser.length) {
          const isUser = listUser.find(({ _id }) => _id === infoUser._id) as InfoUser;
          if (isUser._id) {
            this.userDriversController.updateStatusSocket(isUser._id, true);
            /** send notify **/
            socket.emit(SOCKET_COMMIT.SEND_MESSAGE_NOTIFY, `Hello ${isUser.fullName}`);
            socket.broadcast.emit(
              SOCKET_COMMIT.CHANGE_STATUS_ONLINE,
              changeStatusLogin(isUser, true)
            );
            socket.broadcast.emit(SOCKET_COMMIT.SEND_MESSAGE_NOTIFY, `${isUser.fullName} Online`);
          }
        }
      });
      /** send messages **/
      socket.on(
        SOCKET_COMMIT.SEND_MESSAGE,
        (infoUser: InfoUser, dataMessages: DataMessages, callBackAcknow: Function) => {
          const userBySocketId = getUserById(infoUser._id);
          if (userBySocketId) {
            const filter = new Filter();
            filter.addWords(...TEXT_BAD);
            if (filter.isProfane(dataMessages.text)) {
              return callBackAcknow(SOCKET_COMMIT.MESSAGE_NOT_AVALID);
            }
            socket_io.emit(SOCKET_COMMIT.SEND_LIST_MESSAGE, renderMessages(dataMessages));
            socket.broadcast.emit(SOCKET_COMMIT.SEND_MESSAGE_SENDER, {
              userBySender: changeStatusIsNewMsg(userBySocketId as InfoUser, true),
              reciverId: dataMessages.reciverId,
              message: `${userBySocketId.fullName} did messages for you.`
            });
            callBackAcknow();
            this.messagesDriversController.createNewMessagesSocket(dataMessages);
          }
        }
      );
      /** disconnect **/
      socket.on(SOCKET_COMMIT.DISCONNECTED, (infoUser: InfoUser) => {
        const userBySocketId = getUserById(infoUser._id);
        if (userBySocketId) {
          socket.broadcast.emit(
            SOCKET_COMMIT.CHANGE_STATUS_OFFLINE,
            changeStatusLogin(userBySocketId, false)
          );
          socket.broadcast.emit(
            SOCKET_COMMIT.SEND_MESSAGE_NOTIFY,
            `${userBySocketId.fullName} offline`
          );
        }
        removeUserList(infoUser._id);
        this.userDriversController.updateStatusSocket(infoUser._id, false);
      });
    });
  }
}
