const { User } = require("../models/userModel");

const getUserListController = async (req, res) => {
    try {
        const userList = await User.find()
        res.status(200).send(userList)
    } catch (error) {
        res.status(500).send(error)
    }
}

module.exports = {
    getUserListController
}