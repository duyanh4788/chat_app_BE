import { Socket } from 'socket.io';
import * as JWT from 'jsonwebtoken';
import Filter from 'bad-words';
import { SocketInterface } from '../interface/SocketInterface';
import { MessagesDriversController } from '../../MongoDriversController/MessagesDriversController';
import { UserDriversController } from '../../MongoDriversController/UserDriversController';
import { SECRETKEY, SOCKET_COMMIT, TEXT_BAD } from '../../common/common.constants';
import { createUser, getUserById, removeUserList } from '../../utils/createUsers';
import { changeStatusIsNewMsg, changeStatusLogin, renderMessages } from '../../utils/createMessages';
import { DataMessages, InfoUser } from '../../common/common.interface';

const userSockets = new Map();
export class OrdersSocket implements SocketInterface {
  private messagesDriversController!: MessagesDriversController;
  private userDriversController!: UserDriversController;

  handleChatApp(socket: Socket) {
    this.messagesDriversController = new MessagesDriversController();
    this.userDriversController = new UserDriversController();
    /** Connect **/
    socket.on(SOCKET_COMMIT.JOIN_ROOM, (infoUser: InfoUser) => {
      const listUser = createUser(socket, infoUser);
      if (listUser && listUser.length) {
        const isUser = listUser.find(({ _id }) => _id === infoUser._id) as InfoUser;
        const currentUserSocketId = userSockets.get(infoUser._id);
        if (isUser._id !== currentUserSocketId) {
          this.userDriversController.updateStatusSocket(isUser._id, true);
          /** send notify **/
          socket.emit(SOCKET_COMMIT.SEND_MESSAGE_NOTIFY, `Hello ${isUser.fullName}`);
          socket.broadcast.emit(SOCKET_COMMIT.CHANGE_STATUS_ONLINE, changeStatusLogin(isUser, true));
          socket.broadcast.emit(SOCKET_COMMIT.SEND_MESSAGE_NOTIFY, `${isUser.fullName} Online`);
        }
      }
    });
    /** send messages **/
    socket.on(SOCKET_COMMIT.SEND_MESSAGE, (infoUser: InfoUser, dataMessages: DataMessages, callBackAcknow: Function) => {
      const userBySocketId = getUserById(infoUser._id);
      if (userBySocketId) {
        const filter = new Filter();
        filter.addWords(...TEXT_BAD);
        if (filter.isProfane(dataMessages.text)) {
          return callBackAcknow(SOCKET_COMMIT.MESSAGE_NOT_AVALID);
        }
        socket.emit(SOCKET_COMMIT.SEND_LIST_MESSAGE, renderMessages(dataMessages));
        socket.broadcast.emit(SOCKET_COMMIT.SEND_MESSAGE_SENDER, {
          userBySender: changeStatusIsNewMsg(userBySocketId as InfoUser, true),
          reciverId: dataMessages.reciverId,
          message: `${userBySocketId.fullName} did messages for you.`
        });
        callBackAcknow();
        this.messagesDriversController.createNewMessagesSocket(dataMessages);
      }
    });
    /** disconnect **/
    socket.on(SOCKET_COMMIT.DISCONNECTED, (infoUser: InfoUser) => {
      const userBySocketId = getUserById(infoUser._id);
      const currentUserSocketId = userSockets.get(infoUser._id);
      if (userBySocketId && userBySocketId._id !== currentUserSocketId?.split('-')[1]) {
        socket.broadcast.emit(SOCKET_COMMIT.CHANGE_STATUS_OFFLINE, changeStatusLogin(userBySocketId, false));
        socket.broadcast.emit(SOCKET_COMMIT.SEND_MESSAGE_NOTIFY, `${userBySocketId.fullName} offline`);
      }
      removeUserList(infoUser._id);
      this.userDriversController.updateStatusSocket(infoUser._id, false);
    });
  }

  middlewareAuthorization(socket: Socket, next: any) {
    const { Authorization } = socket.handshake.auth;
    if (!Authorization) {
      return next(new Error('AUTHORIZATION_INVALID'));
    }
    const deCode: any = JWT.verify(Authorization, SECRETKEY);
    const getTime = Math.round(new Date().getTime() / 1000);
    if (deCode || deCode.exp > getTime) {
      const previousSocket = userSockets.get(deCode._id);
      if (previousSocket) {
        socket.join(previousSocket);
        socket.to(previousSocket).emit(SOCKET_COMMIT.DISCONNECTED, { reason: 'Another tab connected' });
      } else {
        const newRoom = `room-${deCode._id}`;
        userSockets.set(deCode._id, newRoom);
        socket.join(newRoom);
      }
      return next();
    }
    return next(new Error('AUTHORIZATION_INVALID'));
  }
}
