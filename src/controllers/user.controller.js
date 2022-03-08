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
    if (!checkAccount) {
      return res.status(400).send({
        code: 400,
        message: "Tài khoản không tồn tại vui lòng đăng ký",
        success: false,
      });
    }
    const checkPassWord = bcrypt.compareSync(passWord, checkAccount.passWord);
    if (!checkPassWord) {
      return res.status(400).send({
        code: 400,
        message: "Mật khẩu không đúng",
        success: false,
      });
    }
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
    if (checkPassWord) {
      return res.status(200).send({
        info: { ...infoUser, toKen },
        message: "Đăng nhập thành công",
        code: 200,
        success: true,
      });
    }
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
    const userList = await UserPrivate.find({}).select([
      "account",
      "fullName",
      "email",
      "avatar",
      "isOnline",
    ]);
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

module.exports = {
  userSignUp,
  userSignIn,
  getListUser,
};
