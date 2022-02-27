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
      status: 200,
      message: "Đăng ký thành công",
      data: [],
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
          message: "Đăng nhập thành công",
          status: 200,
          toKen,
        });
      } else {
        res.status(400).send({
          message: "Mật khẩu không đúng",
          status: 400,
        });
      }
    } else {
      res.status(400).send({
        message: "Tài khoản chưa đăng ký",
        status: 400,
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
      status: 200,
      data: { userList },
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
