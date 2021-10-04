const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    userName: { type: String, require: true },
    room: { type: String, require: true },
    createAt: Date,
    avatar: String,
})

const User = mongoose.model('User', UserSchema);

module.exports = {
    User
}