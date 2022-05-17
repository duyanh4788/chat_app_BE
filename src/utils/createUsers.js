let listUsers = [];

const createUser = (socket, user) => {
  const findUser = listUsers.find(({ _id }) => _id === user._id);
  if (findUser) return [findUser];
  if (!findUser) {
    listUsers.push({ socketId: socket.id, ...user });
  }
  return listUsers;
};

const getSocketById = id => listUsers.find(({ socketId }) => socketId === id);
const getUserById = id => listUsers.find(({ _id }) => _id === id);

const removeUserList = id => {
  const index = listUsers.findIndex(({ _id }) => _id !== id);
  if (index !== -1) {
    return listUsers.splice(index, 1)[0];
  }
};

module.exports = {
  createUser,
  getSocketById,
  getUserById,
  removeUserList,
};
