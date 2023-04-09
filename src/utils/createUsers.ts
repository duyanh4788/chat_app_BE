interface InfoUser {
  socketId: string;
  _id: string;
  account: string;
  fullName: string;
  email: string;
  avatar: string;
  isOnline: boolean;
}

let listUsers: InfoUser[] = [];

export const createUser = (socket: any, user: any): InfoUser[] => {
  const findUser = listUsers.find(({ _id }) => _id === user?._id);
  if (findUser) return listUsers;
  if (!findUser) {
    listUsers.push({ socketId: socket.id, ...user });
  }
  return listUsers;
};

export const getSocketById = (id: string): InfoUser => {
  return listUsers.find(({ socketId }) => socketId === id) as InfoUser;
};

export const getUserById = (id: string): InfoUser => listUsers.find(({ _id }) => _id === id) as InfoUser;

export const removeUserList = (id: string) => {
  const index = listUsers.findIndex(({ _id }) => _id === id);
  if (index !== -1) {
    return listUsers.splice(index, 1);
  }
};
