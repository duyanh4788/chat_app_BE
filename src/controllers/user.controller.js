const { UserPrivate } = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSignUp = async (req, res) => {
  try {
    const { account, passWord, fullName, email } = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hashPassWord = bcrypt.hashSync(passWord, salt);
    const newUser = new UserPrivate({
      account,
      passWord: hashPassWord,
      fullName,
      email,
    });
    await newUser.save();
    res.status(200).send({
      data: null,
      message: "Đăng ký thành công",
      code: 200,
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      code: 500,
      message: error,
      success: false,
    });
  }
};

const userSignIn = async (req, res) => {
  const { account, passWord } = req.body;
  try {
    const checkAccount = await UserPrivate.findOne({ account });
    !checkAccount &&
      res.status(400).send({
        code: 400,
        message: "Mật khẩu không đúng",
        success: false,
      });
    const checkPassWord = bcrypt.compareSync(passWord, checkAccount.passWord);
    !checkPassWord &&
      res.status(400).send({
        code: 400,
        message: "Mật khẩu không đúng",
        success: false,
      });
    const infoUser = {
      id: checkAccount.id,
      account: checkAccount.account,
      fullName: checkAccount.fullName,
      email: checkAccount.email,
      avatar: checkAccount.avatar,
      isOnline: checkAccount.isOnline,
      userTypeCode: checkAccount.userTypeCode,
    };
    const secrectKey = "123456";
    const toKen = jwt.sign(infoUser, secrectKey, { expiresIn: 3600 });
    checkPassWord &&
      res.status(200).send({
        info: { ...infoUser, toKen },
        message: "Đăng nhập thành công",
        code: 200,
        success: true,
      });
  } catch (error) {
    res.status(500).send({
      code: 500,
      message: error,
      success: false,
    });
  }
};

const getListUser = async (req, res) => {
  try {
    const userList = await UserPrivate.find();
    !userList &&
      res.status(400).send({
        code: 400,
        message: "DATA NOT FOUND!",
        success: false,
      });
    userList &&
      res.status(200).send({
        data: userList,
        code: 200,
        success: true,
      });
  } catch (error) {
    res.status(500).send({
      code: 500,
      message: error,
      success: false,
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const userById = await UserPrivate.findOne({ id: req.query.id });
    !userById &&
      res.status(400).send({
        data: null,
        message: "User By Id not found!",
        code: 400,
        success: true,
      });
    userById &&
      res.status(200).send({
        data: userById,
        message: null,
        code: 200,
        success: true,
      });
  } catch (error) {
    res.status(500).send({
      code: 500,
      message: error,
      success: false,
    });
  }
};

const getFriendById = async (req, res) => {
  try {
    const myFriend = await UserPrivate.findOne(req.query.id);
    !myFriend &&
      res.status(400).send({
        data: null,
        message: "My Friend not found!",
        code: 400,
        success: true,
      });
    myFriend &&
      res.status(200).send({
        data: myFriend,
        message: null,
        code: 200,
        success: true,
      });
  } catch (error) {
    res.status(500).send({
      code: 500,
      message: error,
      success: false,
    });
  }
};

module.exports = {
  userSignUp,
  userSignIn,
  getListUser,
  getUserById,
  getFriendById,
};
