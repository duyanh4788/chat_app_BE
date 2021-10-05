const { User } = require("../models/userModel")

let userLists = []

const addUserList = ({ userName, room, email }) => {
    try {
        const checkEmail = User.findOne({ email })
        if (checkEmail) {
            return
        } else {
            const newUser = new User({
                userName,
                room,
                email,
                createAt: new Date(),
            })
            newUser.save()
            return userLists = [...userLists, newUser]
        }
    } catch (error) {
        console.log(error);
    }
}

const getUserList = (room) => (userLists.filter(item => item.room === room))

const removeUserList = (id) => (userLists = userLists.filter(item => item.id !== id))

module.exports = {
    getUserList,
    addUserList,
    removeUserList
}
