interface InfoUser {
  socketId: string;
  _id: string;
  account: string;
  fullName: string;
  email: string;
  avatar: string;
  isOnline: boolean;
}

export const renderMessages = ({ conversationId, senderId, reciverId, text }: any) => {
  if (text && text !== null) {
    const data = {
      conversationId,
      senderId,
      reciverId,
      text
    };
    return data;
  }
};

export const changeStatusLogin = (user: InfoUser, isOnline: boolean) => {
  const data = {
    account: user.account,
    avatar: user.avatar,
    email: user.email,
    fullName: user.fullName,
    isOnline,
    _id: user._id
  };
  return data;
};

export const changeStatusIsNewMsg = (user: InfoUser, isNewMsg: boolean) => {
  const data = {
    account: user.account,
    avatar: user.avatar,
    email: user.email,
    fullName: user.fullName,
    isOnline: user.isOnline,
    isNewMsg,
    _id: user._id
  };
  return data;
};
