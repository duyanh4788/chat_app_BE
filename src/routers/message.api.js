const { Router } = require("express");
const { UserPrivate } = require("../models/userModel");
const messageRouter = Router();
const {
  postNewMessages,
  postConvertStationMyFriend,
} = require("../controllers/message.controller");
const { checkUserId } = require("../middlewares/messages/message.middleware");

messageRouter.post("/newMessage", checkUserId(UserPrivate), postNewMessages);
messageRouter.post(
  "/convertStationMyFriend/",
  checkUserId(UserPrivate),
  postConvertStationMyFriend
);

module.exports = {
  messageRouter,
};
