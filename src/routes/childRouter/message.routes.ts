import { Request, Response } from 'express';

export class MessagesRoutes {
  public routes(app): void {
    app.route('/getListMessages').get((req: Request, res: Response) => {
      res.status(200).send({
        message: 'Get List Success',
      });
    });
  }
}

// const { Router } = require("express");
// const { UserPrivate } = require("../models/userModel");
// const { ConvertStation } = require("../models/convertStationModel");
// const messageRouter = Router();
// const {
//   postNewMessages,
//   getListMessages,
// } = require("../controllers/message.controller");
// const {
//   checkUserId,
//   checkConvertStationId,
// } = require("../middlewares/messages/message.middleware");

// messageRouter.post("/newMessage", checkUserId(UserPrivate), postNewMessages);
// messageRouter.post(
//   "/getListMessages/",
//   checkConvertStationId(ConvertStation),
//   getListMessages
// );

// module.exports = {
//   messageRouter,
// };
