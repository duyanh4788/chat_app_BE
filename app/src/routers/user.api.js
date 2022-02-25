const { Router } = require("express");
const { User } = require("../models/userModel");
const {
  getUserListController,
  userSignUp,
  userSignIn,
} = require("../controllers/user.controller");
const {
  checkAccount,
  checkEmailExits,
} = require("../middlewares/auth/authUser.middleware");
const userRouter = Router();

userRouter.get("/listUser", getUserListController);
userRouter.post("/signIn", userSignIn);
userRouter.post(
  "/signUp",
  checkAccount(User),
  checkEmailExits(User),
  userSignUp
);

module.exports = {
  userRouter,
};
