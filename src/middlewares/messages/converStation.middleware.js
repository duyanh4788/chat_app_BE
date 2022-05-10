const getConverStationByUserId = Model => async (req, res, next) => {
  try {
    const converStationByUserId = await Model.findOne({
      members: { $all: [req.body.senderId, req.body.reciverId] },
    });
    if (converStationByUserId !== null) {
      return res.status(200).send({
        data: converStationByUserId,
        code: 200,
        success: true,
      });
    }
    if (converStationByUserId === null) {
      next();
    }
  } catch (error) {
    res.status(500).send({
      code: 500,
      message: error,
      success: false,
    });
  }
};

module.exports = {
  getConverStationByUserId,
};
