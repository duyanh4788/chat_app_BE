const { Router } = require("express");
const { UserPrivate } = require("../models/userModel");
const {
  userSignUp,
  userSignIn,
  getListUser,
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
  checkAccount(UserPrivate),
  checkEmailExits(UserPrivate),
  checkEmpty,
  checkEmailPattern,
  checkReqLength,
  checkFullName,
  userSignUp
);

userRouter.get("/listUser", getListUser);

module.exports = {
  userRouter,
};
