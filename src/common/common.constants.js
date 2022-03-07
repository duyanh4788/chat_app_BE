const TitleModel = {
  LIST_MESSAGES: "ListMessages",
  MESSAGE: "Messages",
  MESSAGE_PRIVATE: "MessagesPrivate",
  USER: "User",
  USER_PRIVATE: "UserPrivate",
  ROOM: "Room",
  CONVERSTATION: "converstation",
};

const SOCKET_COMMIT = {
  CONNECT: "connect",
  JOIN_ROOM: "join_room",
  SEND_MESSAGE: "send_message",
  SEND_LIST_MESSAGE: "send_list_message",
  SEND_LOCATION: "send_location",
  SEND_MESSAGE_NOTIFY: "send_message_notify",
  SEND_LIST_USERS: "send_list_users",
  MESSAGE_NOT_AVALID: "Xin đừng chửi láo",
  DISCONNECTED: "disconnected",
};

const TEXT_BAD = ["con cặc", "địt mẹ", "đụ má", "chó đẻ", "cặc", "địt"];

module.exports = {
  TitleModel,
  SOCKET_COMMIT,
  TEXT_BAD,
};
