const TitleModel = {
  LIST_MESSAGES: 'ListMessages',
  MESSAGE: 'Messages',
  USER: 'User',
  USER_PRIVATE: 'UserPrivate',
  ROOM: 'Room',
  MESSAGE_PRIVATE: 'MessagesPrivate',
  CONVERTSTATION: 'convertstation',
};

const SOCKET_COMMIT = {
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

const TEXT_BAD = ['con cặc', 'địt mẹ', 'đụ má', 'chó đẻ', 'cặc', 'địt'];

const USER_TYPE_CODE = ['ADMIN', 'SUPER_ADMIN'];
const SECRETKEY = '1234@Abcd';

module.exports = {
  TitleModel,
  SOCKET_COMMIT,
  TEXT_BAD,
  USER_TYPE_CODE,
  SECRETKEY,
};
