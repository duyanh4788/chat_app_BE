const { Router } = require('express');
const { UserPrivate } = require('../models/userModel');
const {
  userSignUp,
  userSignIn,
  getListUser,
  getUserById,
  changeStatusOnline,
  changeStatusOffline,
} = require('../controllers/user.controller');
const {
  checkAccount,
  checkEmailExits,
  checkEmpty,
  checkEmailPattern,
  checkNumber,
  checkFullName,
  checkReqLength,
} = require('../middlewares/auth/authUser.middleware');
const { authenTicate } = require('../middlewares/auth/verifyToken.middleware');
const userRouter = Router();

userRouter.post('/signIn', userSignIn);

userRouter.post(
  '/signUp',
  checkAccount(UserPrivate),
  checkEmailExits(UserPrivate),
  checkEmpty,
  checkEmailPattern,
  checkReqLength,
  checkFullName,
  userSignUp,
);

userRouter.get('/listUser', authenTicate, getListUser);
userRouter.get('/getUserById/:id', authenTicate, getUserById);

userRouter.post('/changeStatusOnline', changeStatusOnline);
userRouter.post('/changeStatusOffline', changeStatusOffline);

module.exports = {
  userRouter,
};
