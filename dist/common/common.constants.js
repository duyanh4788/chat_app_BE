"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SECRETKEY = exports.USER_TYPE_CODE = exports.TEXT_BAD = exports.SOCKET_COMMIT = exports.TitleModel = void 0;
exports.TitleModel = {
    LIST_MESSAGES: 'ListMessages',
    MESSAGES: 'Messages',
    USERS: 'Users',
    ROOM: 'Room',
    CONVERTSTATIONS: 'convertstations',
};
exports.SOCKET_COMMIT = {
    CONNECT: 'connect',
    JOIN_ROOM: 'join_room',
    SEND_MESSAGE: 'send_message',
    SEND_LIST_MESSAGE: 'send_list_message',
    SEND_MESSAGE_NOTIFY: 'send_message_notify',
    SEND_MESSAGE_SENDER: 'send_message_sender',
    SEND_LIST_USERS: 'send_list_users',
    CHANGE_STATUS_ONLINE: 'change_status_online',
    CHANGE_STATUS_OFFLINE: 'change_status_offline',
    MESSAGE_NOT_AVALID: 'Xin đừng chửi láo',
    DISCONNECTED: 'disconnected',
};
exports.TEXT_BAD = ['con cặc', 'địt mẹ', 'đụ má', 'chó đẻ', 'cặc', 'địt'];
exports.USER_TYPE_CODE = ['ADMIN', 'SUPER_ADMIN'];
exports.SECRETKEY = '1234@Abcd';
//# sourceMappingURL=common.constants.js.map