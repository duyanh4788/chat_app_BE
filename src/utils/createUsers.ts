let listUsers: any = [];

export const createUser = (socket, user) => {
  const findUser = listUsers.find(({ _id }) => _id === user._id);
  if (findUser) return [findUser];
  if (!findUser) {
    listUsers.push({ socketId: socket.id, ...user });
  }
  return listUsers;
};

export const getSocketById = id =>
  listUsers.find(({ socketId }) => socketId === id);
export const getUserById = id => listUsers.find(({ _id }) => _id === id);

export const removeUserList = id => {
  const index = listUsers.findIndex(({ _id }) => _id !== id);
  if (index !== -1) {
    return listUsers.splice(index, 1)[0];
  }
};
