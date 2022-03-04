const TitleModel = {
    LIST_MESSAGES : 'ListMessages',
    MESSAGE : 'Messages',
    USER : 'User',
    ROOM : 'Room'
}

const SOCKET_COMMIT = {
    JOIN_ROOM: 'join room',
    ADD_CLIENT_JOIN_ROOM : 'add client join room',
    SEND_LIST_CLIENT: 'send list client inside room',
    SEND_MESSAGE: 'send message',
    SEND_ARRAY_MESSAGE: 'send array message',
    SEND_LOCATION: 'send location',
    SERVER_SEND_LOCATION: 'server send location',
    DISCONNECT: 'disconnect',
    SEND_MESSAGE_NOTIFY: 'send message notify',
    MESSAGE_NOT_AVALID : 'Message Not Available'
  };

const TEXT_BAD = ['con cặc', 'địt mẹ', 'đụ má', 'chó đẻ', 'cặc'];
  

module.exports = {
    TitleModel,
    SOCKET_COMMIT,
    TEXT_BAD
}