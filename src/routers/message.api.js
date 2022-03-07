const { Router } = require("express");
const { getListMessage } = require("../controllers/message.controller");
const messageRouter = Router();

messageRouter.get("/listMessage", getListMessage);

module.exports = {
  messageRouter,
};
