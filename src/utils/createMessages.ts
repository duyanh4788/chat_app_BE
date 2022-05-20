interface InfoUser {
  socketId: string;
  _id: string;
  account: string;
  fullName: string;
  email: string;
  avatar: string;
  isOnline: boolean;
}

export const renderMessages = ({
  conversationId,
  senderId,
  reciverId,
  text,
}) => {
  if (text && text !== null) {
    const data = {
      conversationId,
      senderId,
      reciverId,
      text,
    };
    return data;
  }
};

export const changeStatusOnline = (user: InfoUser) => {
  const data = {
    account: user.account,
    avatar: user.avatar,
    email: user.email,
    fullName: user.fullName,
    isOnline: true,
    _id: user._id,
  };
  return data;
};

export const changeStatusOffline = (user: InfoUser) => {
  const data = {
    account: user.account,
    avatar: user.avatar,
    email: user.email,
    fullName: user.fullName,
    isOnline: false,
    _id: user._id,
  };
  return data;
};
