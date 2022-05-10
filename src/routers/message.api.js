const { Router } = require("express");
const { UserPrivate } = require("../models/userModel");
const { ConvertStation } = require("../models/convertStationModel");
const messageRouter = Router();
const {
  postNewMessages,
  getListMessages,
} = require("../controllers/message.controller");
const {
  checkUserId,
  checkConvertStationId,
} = require("../middlewares/messages/message.middleware");

messageRouter.post("/newMessage", checkUserId(UserPrivate), postNewMessages);
messageRouter.post(
  "/getListMessages/",
  checkConvertStationId(ConvertStation),
  getListMessages
);

module.exports = {
  messageRouter,
};
