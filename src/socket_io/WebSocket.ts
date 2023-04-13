import * as JWT from 'jsonwebtoken';
import Filter from 'bad-words';
import { Server, Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { SECRETKEY, SOCKET_COMMIT, TEXT_BAD } from '../common/common.constants';
import { MessagesDriversController } from '../MongoDriversController/MessagesDriversController';
import { UserDriversController } from '../MongoDriversController/UserDriversController';
import { changeStatusIsNewMsg, changeStatusLogin, renderMessages } from '../utils/createMessages';
import { createUser, getUserById, removeUserList } from '../utils/createUsers';
import { DataMessages, InfoUser } from '../common/common.interface';

const userSockets = new Map();
export class WebSocket {
  private messagesDriversController: MessagesDriversController = new MessagesDriversController();
  private userDriversController: UserDriversController = new UserDriversController();

  constructor() {
    this.messagesDriversController.createNewMessages = this.messagesDriversController?.createNewMessages.bind(this);
    this.userDriversController.updateStatus = this.userDriversController.updateStatus.bind(this);
  }

  public socketIO(socket_io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>) {
    socket_io.use((socket: Socket, next) => {
      const { Authorization } = socket.handshake.auth;
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
      next(new Error('AUTHORIZATION_INVALID'));
    });
    socket_io.on(SOCKET_COMMIT.CONNECT, (socket: Socket) => {
      /** Connect **/
      socket.on(SOCKET_COMMIT.JOIN_ROOM, (infoUser: InfoUser) => {
        const listUser = createUser(socket, infoUser);
        if (listUser && listUser.length) {
          const isUser = listUser.find(({ _id }) => _id === infoUser._id) as InfoUser;
          const currentUserSocketId = userSockets.get(infoUser._id);
          if (isUser._id !== currentUserSocketId) {
            this.userDriversController.updateStatusSocket(isUser._id, true);
            /** send notify **/
            // socket.emit(SOCKET_COMMIT.SEND_MESSAGE_NOTIFY, `Hello ${isUser.fullName}`);
            // socket.broadcast.emit(SOCKET_COMMIT.SEND_MESSAGE_NOTIFY, `${isUser.fullName} Online`);
            socket.broadcast.emit(SOCKET_COMMIT.CHANGE_STATUS_ONLINE, changeStatusLogin(isUser, true));
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
          socket_io.emit(SOCKET_COMMIT.SEND_LIST_MESSAGE, renderMessages(dataMessages));
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
        if (infoUser && infoUser._id) {
          const userBySocketId = getUserById(infoUser._id);
          if (userBySocketId) {
            socket.broadcast.emit(SOCKET_COMMIT.CHANGE_STATUS_OFFLINE, changeStatusLogin(userBySocketId, false));
          }
          removeUserList(infoUser._id);
          this.userDriversController.updateStatusSocket(infoUser._id, false);
        }
      });
    });
  }
}
