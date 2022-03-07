const { User } = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSignUp = async (req, res) => {
  try {
    const { account, passWord, fullName, email } = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hashPassWord = bcrypt.hashSync(passWord, salt);
    const newUser = new User({
      account,
      passWord: hashPassWord,
      fullName,
      email,
    });
    await  newUser.save();
    res.status(200).send({
      data: null,
      message: "Đăng ký thành công",
      code: 200,
      success: true,
    });
  } catch (error) {
    res.status(500).error;
  }
};

const userSignIn = async (req, res) => {
  const { account, passWord } = req.body;
  try {
    const checkAccount = await User.findOne({ account });
    if (checkAccount) {
      const checkPassWord = bcrypt.compareSync(passWord, checkAccount.passWord);
      if (checkPassWord) {
        const infoUser = {
          account: checkAccount.account,
          fullName: checkAccount.fullName,
          id: checkAccount.id,
          userTypeCode: checkAccount.userTypeCode,
        };
        const secrectKey = "123456";
        const toKen = jwt.sign(infoUser, secrectKey, { expiresIn: 3600 });
        res.status(200).send({
          info: { ...infoUser, toKen },
          message: "Đăng nhập thành công",
          code: 200,
          success: true,
        });
      } else {
        res.status(400).send({
          code: 400,
          message: "Mật khẩu không đúng",
          success: false,
        });
      }
    } else {
      res.status(400).send({
        code: 400,
        message: "Tài khoản chưa đăng ký",
        success: false,
      });
    }
  } catch (error) {
    res.status(500).error;
  }
};

const getListUser = async (req, res) => {
  try {
    const userList = await User.find();
    if (userList) {
      res.status(200).send({
        data: userList,
        code: 200,
        success: true,
      });
    } else {
      res.status(400).send({
        code: 400,
        message: "DATA ERROR",
        success: false,
      });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  getListUser,
  userSignUp,
  userSignIn,
};
