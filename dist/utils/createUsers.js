"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeUserList = exports.getUserById = exports.getSocketById = exports.createUser = void 0;
let listUsers = [];
const createUser = (socket, user) => {
    const findUser = listUsers.find(({ _id }) => _id === user._id);
    if (findUser)
        return [findUser];
    if (!findUser) {
        listUsers.push(Object.assign({ socketId: socket.id }, user));
    }
    return listUsers;
};
exports.createUser = createUser;
const getSocketById = (id) => listUsers.find(({ socketId }) => socketId === id);
exports.getSocketById = getSocketById;
const getUserById = (id) => listUsers.find(({ _id }) => _id === id);
exports.getUserById = getUserById;
const removeUserList = (id) => {
    const index = listUsers.findIndex(({ _id }) => _id !== id);
    if (index !== -1) {
        return listUsers.splice(index, 1)[0];
    }
};
exports.removeUserList = removeUserList;
//# sourceMappingURL=createUsers.js.map