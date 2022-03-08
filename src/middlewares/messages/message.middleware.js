const checkUserId = (Model) => async (req, res, next) => {
  const reciverInfo = await Model.findOne({
    _id: req.body.reciverId,
  });
  if (!reciverInfo) {
    return res.status(400).send({
      code: 400,
      message: "reciver id not found!",
      success: false,
    });
  }
  const senderInfor = await Model.findOne({
    _id: req.body.senderId,
  });
  if (!senderInfor) {
    return res.status(400).send({
      code: 400,
      message: "sender id not found!",
      success: false,
    });
  }
  if (reciverInfo && senderInfor) {
    next();
  }
};

module.exports = {
  checkUserId,
};
