const mongoose = require('mongoose');
const { User } = require('./userModel');

const RoomSchema = mongoose.Schema({
    listUser: [User],
})

const Room = mongoose.model('Room', RoomSchema);

module.exports = {
    Room
}