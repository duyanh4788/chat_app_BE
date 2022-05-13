const { UserPrivate } = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { SECRETKEY } = require('../common/common.constants');

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
      data: 'Đăng ký thành công',
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
    const checkAccount = await UserPrivate.findOne({ account });
    if (!checkAccount) {
      return res.status(400).send({
        code: 400,
        message: 'Tài khoản không tồn tại vui lòng đăng ký',
        success: false,
      });
    }
    const checkPassWord = bcrypt.compareSync(passWord, checkAccount.passWord);
    if (!checkPassWord) {
      return res.status(400).send({
        code: 400,
        message: 'Mật khẩu không đúng',
        success: false,
      });
    }
    const header = {
      _id: checkAccount.id,
      account: checkAccount.account,
      userTypeCode: checkAccount.userTypeCode,
    };
    const toKen = jwt.sign(header, SECRETKEY, { expiresIn: 86400000 });
    if (checkPassWord) {
      const infoUser = {
        _id: checkAccount.id,
        account: checkAccount.account,
        fullName: checkAccount.fullName,
        email: checkAccount.email,
        avatar: checkAccount.avatar,
        isOnline: checkAccount.isOnline,
        userTypeCode: checkAccount.userTypeCode,
        toKen,
      };
      return res.status(200).send({
        data: infoUser,
        code: 200,
        success: true,
      });
    }
  } catch (error) {
    res.status(500).error;
  }
};

const getListUser = async (req, res) => {
  try {
    const userList = await UserPrivate.find({}).select([
      'account',
      'fullName',
      'email',
      'avatar',
      'isOnline',
    ]);
    !userList &&
      res.status(400).send({
        code: 400,
        message: 'DATA NOT FOUND!',
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
    const userById = await UserPrivate.findById(req.params.id).select([
      'account',
      'fullName',
      'email',
      'avatar',
      'isOnline',
      '_id',
    ]);
    !userById &&
      res.status(400).send({
        code: 400,
        message: 'User not found!',
        success: false,
      });

    userById &&
      res.status(200).send({
        data: userById,
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

const changeStatusOnline = async (req, res) => {
  try {
    await UserPrivate.findByIdAndUpdate(req.body.id, {
      isOnline: true,
    });
    res.status(200).send({
      data: null,
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

const changeStatusOffline = async (req, res) => {
  try {
    if (!req.body.id) {
      return res.status(400).send({
        code: 400,
        message: 'Id not found',
        success: false,
      });
    }
    await UserPrivate.findByIdAndUpdate(req.body.id, {
      isOnline: false,
    });
    res.status(200).send({
      data: null,
      code: 200,
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
  getListUser,
  getUserById,
  changeStatusOnline,
  changeStatusOffline,
};
