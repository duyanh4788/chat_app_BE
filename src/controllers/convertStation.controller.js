const { ConvertStation } = require("../models/convertStationModel");

const postSaveConverStation = async (req, res) => {
  try {
    const newConverStation = await ConvertStation({
      members: [req.body.senderId, req.body.reciverId],
    });
    const saveConverStation = await newConverStation.save();
    res.status(200).send({
      data: saveConverStation,
      code: 200,
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      code: 500,
      message: error,
      success: false,
    });
  }
};

const getTwoUserId = async (req, res) => {
  try {
    const converStation = await ConvertStation.findOne({
      members: { $all: [req.params.fisUserId, req.params.serconUserId] },
    });
    res.status(200).send({
      data: converStation,
      code: 200,
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      code: 500,
      message: error,
      success: false,
    });
  }
};

module.exports = {
  postSaveConverStation,
  getTwoUserId,
};
