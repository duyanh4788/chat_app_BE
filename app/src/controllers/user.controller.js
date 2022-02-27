const { User } = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSignUp = async (req, res) => {
  try {
    const { account, passWord, fullName, email } = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hashPassWord = bcrypt.hashSync(passWord, salt);
    const data = {
      account,
      passWord: hashPassWord,
      fullName,
      email,
      userTypeCode: "USER",
    };
    await User.create(data);
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
        const payload = {
          account: checkAccount.account,
          fullName: checkAccount.fullName,
          userTypeCode: checkAccount.userTypeCode,
        };
        const secrectKey = "123456";
        const toKen = jwt.sign(payload, secrectKey, { expiresIn: 360 });
        res.status(200).send({
          data: toKen,
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
    res.status(200).send({
      result: {
        data: { userList },
        message: null,
        errorCode: 200,
        errors: null,
      },
      returnCode: 200,
      success: true,
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  getListUser,
  userSignUp,
  userSignIn,
};
