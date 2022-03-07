const { Router } = require("express");
const messageRouter = Router();
const {
  getListMessage,
  postNewMessages,
  getConverstationId,
} = require("../controllers/message.controller");

messageRouter.get("/listMessage", getListMessage);
messageRouter.post("/newMessage", postNewMessages);
messageRouter.get("/:converstationId", getConverstationId);

module.exports = {
  messageRouter,
};
