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

export const changeStatusOnline = user => {
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

export const changeStatusOffline = user => {
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
