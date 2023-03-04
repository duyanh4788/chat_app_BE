"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Websocket = void 0;
const bad_words_1 = __importDefault(require("bad-words"));
const common_constants_1 = require("../common/common.constants");
const createMessages_1 = require("../utils/createMessages");
const createUsers_1 = require("../utils/createUsers");
class Websocket {
    socketIO(socket_io) {
        socket_io.on(common_constants_1.SOCKET_COMMIT.CONNECT, (socket) => {
            /** Connect **/
            socket.on(common_constants_1.SOCKET_COMMIT.JOIN_ROOM, (infoUser) => {
                const listUser = (0, createUsers_1.createUser)(socket, infoUser);
                if (listUser && listUser.length) {
                    const isUser = listUser.find(({ _id }) => _id === infoUser._id);
                    /** send notify **/
                    socket.emit(common_constants_1.SOCKET_COMMIT.SEND_MESSAGE_NOTIFY, `Hello ${isUser.fullName}`);
                    socket.broadcast.emit(common_constants_1.SOCKET_COMMIT.CHANGE_STATUS_ONLINE, (0, createMessages_1.changeStatusOnline)(isUser));
                    socket.broadcast.emit(common_constants_1.SOCKET_COMMIT.SEND_MESSAGE_NOTIFY, `${isUser.fullName} Online`);
                }
            });
            /** send messages **/
            socket.on(common_constants_1.SOCKET_COMMIT.SEND_MESSAGE, (infoUser, dataMessages, callBackAcknow) => {
                const userBySocketId = (0, createUsers_1.getUserById)(infoUser._id);
                if (userBySocketId) {
                    const filter = new bad_words_1.default();
                    filter.addWords(...common_constants_1.TEXT_BAD);
                    if (filter.isProfane(dataMessages.text)) {
                        return callBackAcknow(common_constants_1.SOCKET_COMMIT.MESSAGE_NOT_AVALID);
                    }
                    socket_io.emit(common_constants_1.SOCKET_COMMIT.SEND_LIST_MESSAGE, (0, createMessages_1.renderMessages)(dataMessages));
                    socket.broadcast.emit(common_constants_1.SOCKET_COMMIT.SEND_MESSAGE_SENDER, `${userBySocketId.fullName} nhắn tin`);
                    callBackAcknow();
                }
            });
            /** disconnect **/
            socket.on(common_constants_1.SOCKET_COMMIT.DISCONNECTED, (infoUser) => {
                const userBySocketId = (0, createUsers_1.getUserById)(infoUser._id);
                if (userBySocketId) {
                    socket.broadcast.emit(common_constants_1.SOCKET_COMMIT.CHANGE_STATUS_OFFLINE, (0, createMessages_1.changeStatusOffline)(userBySocketId));
                    socket.broadcast.emit(common_constants_1.SOCKET_COMMIT.SEND_MESSAGE_NOTIFY, `${userBySocketId.fullName} offline`);
                }
                (0, createUsers_1.removeUserList)(infoUser._id);
            });
        });
    }
}
exports.Websocket = Websocket;
//# sourceMappingURL=socket_io.js.map