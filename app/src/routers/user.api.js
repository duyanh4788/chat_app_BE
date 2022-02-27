const { Router } = require("express");
const { User } = require("../models/userModel");
const {
  getListUser,
  userSignUp,
  userSignIn,
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

userRouter.get("/listUser", getListUser);
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

module.exports = {
  userRouter,
};
