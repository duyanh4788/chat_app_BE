const { User } = require("../models/userModel");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSignUp = async (req, res) => {
    try {
        const { account, passWord, fullName, email, userTypeCode } = req.body;
        const salt = bcrypt.genSaltSync(10);
        const hashPassWord = bcrypt.hashSync(passWord, salt)
        const newUser = await createUserService({
            account, passWord: hashPassWord, fullName, email, userTypeCode,
        })
        res.status(200).send(newUser)
    } catch (error) {
        res.status(500).error
    }
}

const userSignIn = async (req, res) => {
    const { account, passWord } = req.body;
    try {
        const checkAccount = await User.findOne({
            where: {
                account
            }
        })
        if (checkAccount) {
            const checkPassWord = bcrypt.compareSync(passWord, checkAccount.passWord)
            if (checkPassWord) {
                const payload = {
                    account: checkAccount.account,
                    fullName: checkAccount.fullName,
                    userTypeCode: checkAccount.userTypeCode,
                }
                const secrectKey = "123456";
                const toKen = jwt.sign(payload, secrectKey, { expiresIn: 360 });
                res.status(200).send({
                    message: "LOGIN SUCCESSFULLY",
                    toKen
                })
            } else {
                res.status(400).send({
                    message: "PASSWORD IS WRONG"
                })
            }
        } else {
            res.status(400).send({
                message: "EMAIL DOES NOT EXIST"
            })
        }
    } catch (error) {
        res.status(500).error
    }
}

const getUserListController = async (req, res) => {
    try {
        const userList = await User.find()
        res.status(200).send(userList)
    } catch (error) {
        res.status(500).send(error)
    }
}

module.exports = {
    getUserListController,
    userSignUp,
    userSignIn
}