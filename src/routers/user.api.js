const { Router } = require("express");
const { User } = require("../models/userModel");
const {
  userSignUp,
  userSignIn,
  getListUser,
  getUserById,
  getFriendById,
} = require("../controllers/user.controller");
const {
  checkAccount,
  checkEmailExits,
  checkEmpty,
  checkEmailPattern,
  checkNumber,
  checkFullName,
  checkReqLength,
} = require("../middlewares/auth/authUser.middleware");
const userRouter = Router();

userRouter.post("/signIn", userSignIn);

userRouter.post(
  "/signUp",
  checkAccount(User),
  checkEmailExits(User),
  checkEmpty,
  checkEmailPattern,
  checkReqLength,
  checkFullName,
  userSignUp
);

userRouter.get("/listUser", getListUser);

userRouter.get("/userById/:id", getUserById);

userRouter.get("/friendById/:id", getFriendById);

module.exports = {
  userRouter,
};
