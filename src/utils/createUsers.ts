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

export const createUser = (socket: any, user: any) => {
  const findUser = listUsers.find(({ _id }) => _id === user?._id);
  if (findUser) return [findUser];
  if (!findUser) {
    listUsers.push({ socketId: socket.id, ...user });
  }
  return listUsers;
};

export const getSocketById = (id: string) => listUsers.find(({ socketId }) => socketId === id);

export const getUserById = (id: string) => listUsers.find(({ _id }) => _id === id);

export const removeUserList = (id: string) => {
  const index = listUsers.findIndex(({ _id }) => _id !== id);
  if (index !== -1) {
    return listUsers.splice(index, 1)[0];
  }
};
