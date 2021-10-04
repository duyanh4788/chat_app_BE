const { User } = require("../models/userModel")

let userLists = []

const addUserList = async (user) => {
    const newUser = new User({
        userName: user.userName,
        room: user.room,
        createAt: new Date(),
    })
    /** add client join room */
    await newUser.save()
    return userLists = [...userLists, newUser]
}

const getUserList = (room) => (userLists.filter(item => item.room === room))

const removeUserList = (id) => (userLists = userLists.filter(item => item.id !== id))

module.exports = {
    getUserList,
    addUserList,
    removeUserList
}
