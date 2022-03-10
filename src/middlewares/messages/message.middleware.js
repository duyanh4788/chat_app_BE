const checkUserId = (Model) => async (req, res, next) => {
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
  if (senderInfor) {
    next();
  }
};

const checkConvertStationId = (Model) => async (req, res, next) => {
  const convertStationId = await Model.findOne({
    _id: req.body.conversationId,
  });
  if (!convertStationId) {
    return res.status(400).send({
      code: 400,
      message: "convert station id not found!",
      success: false,
    });
  }
  if (convertStationId) {
    next();
  }
};

module.exports = {
  checkUserId,
  checkConvertStationId
};
